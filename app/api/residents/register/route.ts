import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/auth';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  age: z.coerce.number().int().min(1, 'Age must be at least 1').max(120, 'Invalid age'),
  gender: z.enum(['Male', 'Female', 'Other'], { error: 'Please select a gender' }),
  barangay: z.string().min(1, 'Please select your barangay'),
  address: z.string().min(5, 'Please enter your full address'),
  contactNumber: z.string().min(10, 'Contact number must be at least 10 digits'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  idDocument: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? 'Validation error', 400);
    }

    const { firstName, lastName, age, gender, barangay, address, contactNumber, email, password, idDocument } = parsed.data;

    const existing = await prisma.resident.findFirst({ where: { email } });
    if (existing) return errorResponse('An account with this email already exists', 409);

    const count = await prisma.resident.count();
    const year = new Date().getFullYear();
    const residentNumber = `RES-${year}-${String(count + 1).padStart(5, '0')}`;

    const hashed = await bcrypt.hash(password, 12);

    const resident = await prisma.resident.create({
      data: {
        residentNumber,
        firstName,
        lastName,
        age,
        gender,
        barangay,
        address,
        contactNumber,
        email,
        password: hashed,
        idDocument: idDocument ?? null,
        status: 'Pending',
        riskLevel: 'Low',
      },
      select: {
        id: true, residentNumber: true, firstName: true, lastName: true,
        email: true, status: true, registeredAt: true,
      },
    });

    await prisma.activity.create({
      data: {
        type: 'resident_registered',
        message: `New resident self-registered: ${firstName} ${lastName} (${residentNumber})`,
        entityId: resident.id,
        entityType: 'Resident',
        color: '#14b8a6',
      },
    });

    return successResponse(resident, 201);
  } catch {
    return errorResponse('Server error', 500);
  }
}
