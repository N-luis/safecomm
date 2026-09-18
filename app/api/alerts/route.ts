import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/auth';

const createSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  level: z.string().optional(),
  barangay: z.string().optional(),
  expiresAt: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;

  try {
    const alerts = await prisma.alert.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(alerts);
  } catch {
    return errorResponse('Server error', 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;
  if (auth.user.role !== 'admin' && auth.user.role !== 'system_admin') return errorResponse('Forbidden', 403);

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0]?.message ?? parsed.error.message, 400);

    const { expiresAt, ...rest } = parsed.data;
    const alert = await prisma.alert.create({
      data: expiresAt ? { ...rest, expiresAt: new Date(expiresAt) } : rest,
    });
    return successResponse(alert, 201);
  } catch {
    return errorResponse('Server error', 500);
  }
}
