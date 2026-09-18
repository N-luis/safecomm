import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/auth';

const editSchema = z.object({
  content: z.string().min(1).optional(),
  outcome: z.string().optional().nullable(),
});

type Params = { params: Promise<{ id: string; fid: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;
  const { id, fid } = await params;

  try {
    const body = await req.json();
    const parsed = editSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0]?.message ?? 'Validation error', 400);

    const existing = await prisma.caseFollowUp.findUnique({ where: { id: fid } });
    if (!existing) return errorResponse('Follow-up not found', 404);
    if (existing.caseId !== id) return errorResponse('Not found', 404);

    const isOwn = existing.userId === auth.user.userId;
    const isAdmin = auth.user.role === 'admin' || auth.user.role === 'system_admin';
    if (!isOwn && !isAdmin) return errorResponse('Forbidden', 403);

    const updated = await prisma.caseFollowUp.update({
      where: { id: fid },
      data: { ...parsed.data },
      include: { user: { select: { id: true, name: true, role: true } } },
    });
    return successResponse(updated);
  } catch {
    return errorResponse('Server error', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;
  const { id, fid } = await params;

  try {
    const existing = await prisma.caseFollowUp.findUnique({ where: { id: fid } });
    if (!existing) return errorResponse('Follow-up not found', 404);
    if (existing.caseId !== id) return errorResponse('Not found', 404);

    const isOwn = existing.userId === auth.user.userId;
    const isAdmin = auth.user.role === 'admin' || auth.user.role === 'system_admin';
    if (!isOwn && !isAdmin) return errorResponse('Forbidden', 403);

    await prisma.caseFollowUp.delete({ where: { id: fid } });
    return successResponse({ deleted: true });
  } catch {
    return errorResponse('Server error', 500);
  }
}
