import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;

  try {
    const [pending, verified, rejected] = await Promise.all([
      prisma.resident.count({ where: { status: 'Pending' } }),
      prisma.resident.count({ where: { status: 'Active' } }),
      prisma.resident.count({ where: { status: 'Rejected' } }),
    ]);

    return successResponse({ pending, verified, rejected });
  } catch {
    return errorResponse('Server error', 500);
  }
}
