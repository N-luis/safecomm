import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;

  try {
    const [totalCases, activeCases, totalResidents, pendingReports, totalReports, resolvedCases, criticalCases, activeAlerts] =
      await Promise.all([
        prisma.case.count(),
        prisma.case.count({ where: { status: { in: ['Open', 'In Progress'] } } }),
        prisma.resident.count(),
        prisma.report.count({ where: { status: 'Pending' } }),
        prisma.report.count(),
        prisma.case.count({ where: { status: 'Resolved' } }),
        prisma.case.count({ where: { riskLevel: 'Critical' } }),
        prisma.alert.count({ where: { active: true } }),
      ]);

    const resolutionRate = totalCases > 0 ? Math.round((resolvedCases / totalCases) * 100) : 0;

    return successResponse({
      totalCases,
      activeCases,
      totalResidents,
      pendingReports,
      totalReports,
      resolvedCases,
      criticalCases,
      activeAlerts,
      resolutionRate,
    });
  } catch {
    return errorResponse('Server error', 500);
  }
}
