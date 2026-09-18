import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;

  try {
    const [total, activeCount, byRoleRaw] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { active: true } }),
      prisma.user.groupBy({ by: ['role'], _count: { id: true } }),
    ]);

    const byRole = byRoleRaw.map(r => ({ role: r.role, count: r._count.id }));

    return successResponse({ total, activeCount, byRole });
  } catch {
    return errorResponse('Server error', 500);
  }
}
