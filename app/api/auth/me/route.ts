import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.user.userId },
      select: { id: true, name: true, email: true, role: true, barangay: true, phone: true, avatar: true, active: true, createdAt: true },
    });
    if (!user) return errorResponse('User not found', 404);
    return successResponse(user);
  } catch {
    return errorResponse('Server error', 500);
  }
}

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(),
  barangay: z.string().optional().nullable(),
});

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0]?.message ?? parsed.error.message, 400);

    if (parsed.data.email) {
      const existing = await prisma.user.findFirst({
        where: { email: parsed.data.email, NOT: { id: auth.user.userId } },
      });
      if (existing) return errorResponse('Email already in use by another account', 409);
    }

    const updated = await prisma.user.update({
      where: { id: auth.user.userId },
      data: parsed.data,
      select: { id: true, name: true, email: true, role: true, barangay: true, phone: true, avatar: true },
    });

    return successResponse(updated);
  } catch {
    return errorResponse('Server error', 500);
  }
}
