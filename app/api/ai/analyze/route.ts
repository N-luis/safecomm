import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/auth';
import { computeRisk } from '@/lib/riskEngine';

const bodySchema = z.object({ caseId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;

  try {
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) return errorResponse(parsed.error.issues[0]?.message ?? 'Invalid body', 400);

    const c = await prisma.case.findUnique({
      where: { id: parsed.data.caseId },
      select: {
        id: true, caseNumber: true, residentName: true, caseType: true,
        status: true, riskLevel: true, barangay: true, filedAt: true,
        residentId: true, description: true,
      },
    });
    if (!c) return errorResponse('Case not found', 404);

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [barangayCount, residentCount] = await Promise.all([
      prisma.case.count({ where: { barangay: c.barangay, filedAt: { gte: thirtyDaysAgo } } }),
      c.residentId
        ? prisma.case.count({ where: { residentId: c.residentId } })
        : Promise.resolve(0),
    ]);

    const result = computeRisk({
      caseType: c.caseType,
      barangay: c.barangay,
      description: c.description,
      filedAt: c.filedAt,
      residentId: c.residentId,
      status: c.status,
      barangayCaseCount: barangayCount,
      residentPriorCases: Math.max(0, residentCount - 1),
    });

    return successResponse({
      case: {
        id: c.id,
        caseNumber: c.caseNumber,
        residentName: c.residentName,
        caseType: c.caseType,
        status: c.status,
        barangay: c.barangay,
        filedAt: c.filedAt,
        description: c.description,
        previousRiskLevel: c.riskLevel,
      },
      analysis: result,
      context: {
        barangayCasesLast30d: barangayCount,
        residentPriorCases: Math.max(0, residentCount - 1),
      },
    });
  } catch (err) {
    console.error('[AI Analyze]', err);
    return errorResponse('Analysis failed', 500);
  }
}
