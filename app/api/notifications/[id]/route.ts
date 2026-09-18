import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;
  const { id } = await params;

  try {
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) return errorResponse('Notification not found', 404);

    const updated = await prisma.notification.update({ where: { id }, data: { read: true } });
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
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) return errorResponse('Notification not found', 404);

    await prisma.notification.delete({ where: { id } });
    return successResponse({ deleted: true });
  } catch {
    return errorResponse('Server error', 500);
  }
}
