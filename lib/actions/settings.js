'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// Default settings structure
const DEFAULT_SETTINGS = {
  contact: {
    email: 'alviaatif@hotmail.com',
    phone1: '0322 5131504',
    phone2: '0332 8271005',
    whatsapp1: '923225131504',
    whatsapp2: '923328271005',
    person1: 'Aatif Alvi',
    person2: 'Naveed Ahmed',
    address: 'Pakistan',
  },
  social: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    youtube: '',
  },
  seo: {
    siteTitle: 'EV Charging Station Consultant Pakistan | EVConsults',
    siteDescription: "Pakistan's leading EV charging station consultancy.",
    baseUrl: 'https://www.evconsults.pk',
  },
  footer: {
    tagline: 'The leading advisory platform for electric vehicle infrastructure in Pakistan.',
    copyright: 'EVConsults',
  },
};

// ─── Get a single setting by key ────────────────────────
export async function getGlobalSetting(key) {
  try {
    const setting = await prisma.globalSetting.findUnique({ where: { key } });
    return setting?.value ?? DEFAULT_SETTINGS[key] ?? null;
  } catch {
    return DEFAULT_SETTINGS[key] ?? null;
  }
}

// ─── Get multiple settings at once ──────────────────────
export async function getGlobalSettings(keys) {
  try {
    const settings = await prisma.globalSetting.findMany({
      where: { key: { in: keys } },
    });
    const result = {};
    for (const key of keys) {
      const found = settings.find((s) => s.key === key);
      result[key] = found?.value ?? DEFAULT_SETTINGS[key] ?? null;
    }
    return result;
  } catch {
    const result = {};
    for (const key of keys) {
      result[key] = DEFAULT_SETTINGS[key] ?? null;
    }
    return result;
  }
}

// ─── Update a single setting ─────────────────────────────
export async function updateGlobalSetting(key, value) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') return { error: 'Unauthorized' };

  try {
    await prisma.globalSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    // Revalidate all pages that use global settings
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/services');
    revalidatePath('/licensing');
    revalidatePath('/industries');
    revalidatePath('/blog');
    revalidatePath('/contact');
    revalidatePath('/admin/settings');

    return { success: true };
  } catch (err) {
    console.error('[updateGlobalSetting]', err);
    return { error: 'Failed to update setting' };
  }
}

// ─── List all settings (admin) ───────────────────────────
export async function listAllSettings() {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') return [];

  return prisma.globalSetting.findMany({ orderBy: { key: 'asc' } });
}
