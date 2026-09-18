import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/auth';

const updateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  age: z.number().int().min(0).optional(),
  gender: z.string().optional(),
  barangay: z.string().optional(),
  address: z.string().optional(),
  contactNumber: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  status: z.string().optional(),
  riskLevel: z.string().optional(),
  notes: z.string().optional().nullable(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;
  const { id } = await params;

  try {
    const resident = await prisma.resident.findUnique({
      where: { id },
      include: { cases: { orderBy: { filedAt: 'desc' }, take: 5 }, _count: { select: { cases: true } } },
    });
    if (!resident) return errorResponse('Resident not found', 404);
    return successResponse(resident);
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

    const existing = await prisma.resident.findUnique({ where: { id } });
    if (!existing) return errorResponse('Resident not found', 404);

    const updated = await prisma.resident.update({ where: { id }, data: parsed.data });
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
    const existing = await prisma.resident.findUnique({ where: { id } });
    if (!existing) return errorResponse('Resident not found', 404);
    await prisma.resident.delete({ where: { id } });
    return successResponse({ deleted: true });
  } catch {
    return errorResponse('Server error', 500);
  }
}
