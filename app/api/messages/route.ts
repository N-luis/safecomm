import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/auth';

const sendSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
  recipientId: z.string().min(1),
  parentId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;

  const { searchParams } = new URL(req.url);
  const folder = searchParams.get('folder') || 'inbox';
  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || 20)));

  const where =
    folder === 'sent'
      ? { senderId: auth.user.userId, parentId: null }
      : { recipientId: auth.user.userId, parentId: null };

  try {
    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          sender: { select: { id: true, name: true, email: true, role: true } },
          recipient: { select: { id: true, name: true, email: true, role: true } },
          replies: {
            orderBy: { createdAt: 'asc' },
            include: {
              sender: { select: { id: true, name: true, email: true } },
            },
          },
        },
      }),
      prisma.message.count({ where }),
    ]);

    const unreadCount = await prisma.message.count({
      where: { recipientId: auth.user.userId, read: false, parentId: null },
    });

    return successResponse({ messages, total, page, limit, unreadCount });
  } catch {
    return errorResponse('Server error', 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;

  try {
    const body = await req.json();
    const parsed = sendSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0]?.message ?? parsed.error.message, 400);

    const recipient = await prisma.user.findUnique({ where: { id: parsed.data.recipientId } });
    if (!recipient) return errorResponse('Recipient not found', 404);

    const message = await prisma.message.create({
      data: {
        subject: parsed.data.subject,
        body: parsed.data.body,
        senderId: auth.user.userId,
        recipientId: parsed.data.recipientId,
        parentId: parsed.data.parentId ?? null,
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        recipient: { select: { id: true, name: true, email: true } },
      },
    });

    return successResponse(message, 201);
  } catch {
    return errorResponse('Server error', 500);
  }
}
