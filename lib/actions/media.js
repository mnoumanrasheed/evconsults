'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { v2 as cloudinary } from 'cloudinary';
import { mediaSchema } from '@/lib/validations';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Save media record after Cloudinary upload ───────────
export async function createMediaRecord(data) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') return { error: 'Unauthorized' };

  const parsed = mediaSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  try {
    const media = await prisma.media.create({ data: parsed.data });
    revalidatePath('/admin/media');
    return { success: true, media };
  } catch (err) {
    console.error('[createMediaRecord]', err);
    return { error: 'Failed to save media record' };
  }
}

// ─── List all media ──────────────────────────────────────
export async function listMedia() {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') return [];

  return prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
}

// ─── Delete media (Cloudinary + DB) ─────────────────────
export async function deleteMedia(id) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') return { error: 'Unauthorized' };

  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return { error: 'Media not found' };

    // Delete from Cloudinary
    if (process.env.CLOUDINARY_API_SECRET) {
      await cloudinary.uploader.destroy(media.publicId);
    }

    // Delete from DB
    await prisma.media.delete({ where: { id } });
    revalidatePath('/admin/media');
    return { success: true };
  } catch (err) {
    console.error('[deleteMedia]', err);
    return { error: 'Failed to delete media' };
  }
}

// ─── Get Cloudinary upload signature (for client-side upload widget) ──
export async function getUploadSignature() {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') return { error: 'Unauthorized' };

  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = 'evconsults';

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET
  );

  return {
    timestamp,
    signature,
    folder,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  };
}
