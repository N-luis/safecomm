import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('status' in auth) return auth;

  try {
    const [cases, reports] = await Promise.all([
      prisma.case.findMany({ select: { filedAt: true, barangay: true, caseType: true, riskLevel: true, status: true } }),
      prisma.report.findMany({ select: { createdAt: true, status: true } }),
    ]);

    // Monthly trend (last 6 months)
    const now = new Date();
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = d.toLocaleString('default', { month: 'short' });
      const month = d.getMonth();
      const year = d.getFullYear();
      const monthCases = cases.filter(c => {
        const fd = new Date(c.filedAt);
        return fd.getMonth() === month && fd.getFullYear() === year;
      }).length;
      const monthReports = reports.filter(r => {
        const rd = new Date(r.createdAt);
        return rd.getMonth() === month && rd.getFullYear() === year;
      }).length;
      return { name: label, cases: monthCases, reports: monthReports };
    });

    // Barangay incidents
    const barangayCounts: Record<string, number> = {};
    cases.forEach(c => { barangayCounts[c.barangay] = (barangayCounts[c.barangay] || 0) + 1; });
    const barangayData = Object.entries(barangayCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, incidents]) => ({ name, incidents }));

    // Case types
    const typeCounts: Record<string, number> = {};
    cases.forEach(c => { typeCounts[c.caseType] = (typeCounts[c.caseType] || 0) + 1; });
    const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899'];
    const caseTypesData = Object.entries(typeCounts).map(([name, value], i) => ({
      name, value, color: COLORS[i % COLORS.length],
    }));

    // Risk analysis
    const riskLevels = ['Critical', 'High', 'Medium', 'Low'];
    const riskColors = { Critical: '#ef4444', High: '#f59e0b', Medium: '#3b82f6', Low: '#10b981' };
    const riskData = riskLevels.map(level => ({
      subject: level,
      value: cases.filter(c => c.riskLevel === level).length,
      color: riskColors[level as keyof typeof riskColors],
    }));

    return successResponse({ monthlyData, barangayData, caseTypesData, riskData });
  } catch {
    return errorResponse('Server error', 500);
  }
}
