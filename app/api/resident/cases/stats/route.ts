import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireResidentAuth, rSuccess, rError } from '@/lib/residentAuth';

export async function GET(req: NextRequest) {
  const auth = await requireResidentAuth(req);
  if ('status' in auth) return auth;

  const id = auth.resident.residentId;
  const where = { residentId: id };

  try {
    const [total, pending, ongoing, resolved] = await Promise.all([
      prisma.case.count({ where }),
      prisma.case.count({ where: { ...where, status: 'Open' } }),
      prisma.case.count({ where: { ...where, status: 'In Progress' } }),
      prisma.case.count({ where: { ...where, status: { in: ['Resolved', 'Closed'] } } }),
    ]);

    // month-over-month growth: cases this month vs last month
    const now = new Date();
    const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const [thisMonth, lastMonth] = await Promise.all([
      prisma.case.count({ where: { ...where, filedAt: { gte: startThisMonth } } }),
      prisma.case.count({ where: { ...where, filedAt: { gte: startLastMonth, lt: startThisMonth } } }),
    ]);

    const growth = lastMonth === 0 ? null : Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
    const lastUpdatedCase = await prisma.case.findFirst({
      where: { ...where, status: 'In Progress' },
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true },
    });

    return rSuccess({ total, pending, ongoing, resolved, growth, lastUpdatedCase: lastUpdatedCase?.updatedAt ?? null });
  } catch {
    return rError('Server error', 500);
  }
}
