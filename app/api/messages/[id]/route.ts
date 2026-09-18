import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;
  const { id } = await params;

  try {
    const message = await prisma.message.findUnique({
      where: { id },
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
    });

    if (!message) return errorResponse('Not found', 404);
    if (message.senderId !== auth.user.userId && message.recipientId !== auth.user.userId) {
      return errorResponse('Forbidden', 403);
    }

    if (!message.read && message.recipientId === auth.user.userId) {
      await prisma.message.update({ where: { id }, data: { read: true } });
    }

    return successResponse(message);
  } catch {
    return errorResponse('Server error', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;
  const { id } = await params;

  try {
    const message = await prisma.message.findUnique({ where: { id } });
    if (!message) return errorResponse('Not found', 404);
    if (message.recipientId !== auth.user.userId) return errorResponse('Forbidden', 403);

    const updated = await prisma.message.update({ where: { id }, data: { read: true } });
    return successResponse(updated);
  } catch {
    return errorResponse('Server error', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;
  const { id } = await params;

  try {
    const message = await prisma.message.findUnique({ where: { id } });
    if (!message) return errorResponse('Not found', 404);
    if (message.senderId !== auth.user.userId && message.recipientId !== auth.user.userId) {
      return errorResponse('Forbidden', 403);
    }

    await prisma.message.deleteMany({ where: { parentId: id } });
    await prisma.message.delete({ where: { id } });
    return successResponse({ deleted: true });
  } catch {
    return errorResponse('Server error', 500);
  }
}
