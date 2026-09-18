import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse, paginationMeta } from '@/lib/auth';

const createSchema = z.object({
  reportNumber: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  status: z.string().optional(),
  priority: z.string().optional(),
  content: z.string().min(1),
});

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') || 20)));
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDir = searchParams.get('sortDir') === 'asc' ? 'asc' : 'desc';

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { reportNumber: { contains: search } },
      { title: { contains: search } },
      { category: { contains: search } },
    ];
  }
  if (status) where.status = status;

  try {
    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy: { [sortBy]: sortDir },
        skip: (page - 1) * limit,
        take: limit,
        include: { submittedBy: { select: { id: true, name: true } } },
      }),
      prisma.report.count({ where }),
    ]);

    return successResponse({ reports, pagination: paginationMeta(total, page, limit) });
  } catch {
    return errorResponse('Server error', 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0]?.message ?? parsed.error.message, 400);

    const report = await prisma.report.create({
      data: { ...parsed.data, submittedById: auth.user.userId },
    });

    await prisma.activity.create({
      data: {
        type: 'report',
        message: `New report submitted: ${report.title}`,
        entityId: report.id,
        entityType: 'Report',
        userId: auth.user.userId,
        color: '#10b981',
      },
    });

    return successResponse(report, 201);
  } catch {
    return errorResponse('Server error', 500);
  }
}
