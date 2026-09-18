import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;

  try {
    const [total, approved, underReview, pending, rejected] = await Promise.all([
      prisma.report.count(),
      prisma.report.count({ where: { status: 'Approved' } }),
      prisma.report.count({ where: { status: 'Under Review' } }),
      prisma.report.count({ where: { status: 'Pending' } }),
      prisma.report.count({ where: { status: 'Rejected' } }),
    ]);

    return successResponse({ total, approved, underReview, pending, rejected });
  } catch {
    return errorResponse('Server error', 500);
  }
}
