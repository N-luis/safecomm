import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rSuccess, rError } from '@/lib/residentAuth';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email || !email.includes('@')) return rError('Invalid email', 400);

  try {
    const existing = await prisma.resident.findFirst({ where: { email }, select: { id: true } });
    return rSuccess({ available: !existing });
  } catch {
    return rError('Server error', 500);
  }
}
