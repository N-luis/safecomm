import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/auth';

const updateSchema = z.object({
  title: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  content: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;
  const { id } = await params;

  try {
    const report = await prisma.report.findUnique({
      where: { id },
      include: { submittedBy: { select: { id: true, name: true, email: true } } },
    });
    if (!report) return errorResponse('Report not found', 404);
    return successResponse(report);
  } catch {
    return errorResponse('Server error', 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;
  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0]?.message ?? parsed.error.message, 400);

    const existing = await prisma.report.findUnique({ where: { id } });
    if (!existing) return errorResponse('Report not found', 404);

    const updated = await prisma.report.update({ where: { id }, data: parsed.data });
    return successResponse(updated);
  } catch {
    return errorResponse('Server error', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;
  if (auth.user.role !== 'admin') return errorResponse('Forbidden', 403);
  const { id } = await params;

  try {
    const existing = await prisma.report.findUnique({ where: { id } });
    if (!existing) return errorResponse('Report not found', 404);
    await prisma.report.delete({ where: { id } });
    return successResponse({ deleted: true });
  } catch {
    return errorResponse('Server error', 500);
  }
}
