import { NextResponse } from 'next/server';
import { clearResidentCookie, rSuccess } from '@/lib/residentAuth';

export async function POST() {
  const res = rSuccess({ message: 'Logged out' });
  clearResidentCookie(res as NextResponse);
  return res;
}
