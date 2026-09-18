import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { successResponse, errorResponse } from '@/lib/auth';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) return errorResponse('No file provided', 400);
    if (file.size > MAX_SIZE) return errorResponse('File exceeds 5 MB limit', 400);
    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse('Invalid file type. Accepted: JPG, PNG, WEBP, PDF', 400);
    }

    const rawExt = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const ext = ALLOWED_TYPES.includes(`image/${rawExt}`) || rawExt === 'pdf' ? rawExt : 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'ids');
    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));

    return successResponse({
      url: `/uploads/ids/${filename}`,
      filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
    });
  } catch {
    return errorResponse('Upload failed. Please try again.', 500);
  }
}
