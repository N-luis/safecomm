import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;

  try {
    const [total, open, inProgress, resolved, closed, byType] = await Promise.all([
      prisma.case.count(),
      prisma.case.count({ where: { status: 'Open' } }),
      prisma.case.count({ where: { status: 'In Progress' } }),
      prisma.case.count({ where: { status: 'Resolved' } }),
      prisma.case.count({ where: { status: 'Closed' } }),
      prisma.case.groupBy({ by: ['caseType'], _count: { _all: true }, orderBy: { _count: { caseType: 'desc' } } }),
    ]);

    const byCaseType = byType.map(t => ({ caseType: t.caseType, count: t._count._all }));

    return successResponse({ total, open, inProgress, resolved, closed, byCaseType });
  } catch {
    return errorResponse('Server error', 500);
  }
}
