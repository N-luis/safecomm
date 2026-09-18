import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { signResidentToken, setResidentCookie, rSuccess, rError } from '@/lib/residentAuth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return rError(parsed.error.issues[0]?.message ?? 'Invalid body', 400);

    const { email, password } = parsed.data;

    const resident = await prisma.resident.findFirst({
      where: { email },
      select: {
        id: true, firstName: true, lastName: true, email: true,
        password: true, status: true, residentNumber: true,
      },
    });

    if (!resident || !resident.password) return rError('Invalid email or password', 401);

    const valid = await bcrypt.compare(password, resident.password);
    if (!valid) return rError('Invalid email or password', 401);

    const name = `${resident.firstName} ${resident.lastName}`;
    const token = signResidentToken({ residentId: resident.id, email: resident.email ?? '', name, role: 'resident' });

    const res = rSuccess({
      resident: { id: resident.id, name, email: resident.email, status: resident.status, residentNumber: resident.residentNumber },
    });
    setResidentCookie(res as NextResponse, token);
    return res;
  } catch (err) {
    console.error('[Resident Login]', err);
    return rError('Server error', 500);
  }
}
