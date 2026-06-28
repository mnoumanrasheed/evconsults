'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// Map page slug to public route for revalidation
const PAGE_ROUTES = {
  home: '/',
  about: '/about',
  services: '/services',
  licensing: '/licensing',
  industries: '/industries',
};

// ─── Get page with all sections ─────────────────────────
export async function getPageWithSections(slug) {
  return prisma.page.findUnique({
    where: { slug },
    include: { sections: { orderBy: { order: 'asc' } } },
  });
}

// ─── Get single section by key ─────────────────────────
export async function getSectionContent(pageSlug, sectionKey) {
  const page = await prisma.page.findUnique({ where: { slug: pageSlug } });
  if (!page) return null;
  const section = await prisma.section.findUnique({
    where: { pageId_key: { pageId: page.id, key: sectionKey } },
  });
  return section?.content ?? null;
}

// ─── Update section content ─────────────────────────────
export async function updateSectionContent(pageSlug, sectionKey, content) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  try {
    const page = await prisma.page.findUnique({ where: { slug: pageSlug } });
    if (!page) return { error: 'Page not found' };

    await prisma.section.upsert({
      where: { pageId_key: { pageId: page.id, key: sectionKey } },
      update: { content },
      create: { pageId: page.id, key: sectionKey, content, order: 0 },
    });

    const route = PAGE_ROUTES[pageSlug] ?? `/${pageSlug}`;
    revalidatePath(route);
    revalidatePath('/admin/pages');

    return { success: true };
  } catch (err) {
    console.error('[updateSectionContent]', err);
    return { error: 'Failed to update section' };
  }
}

// ─── Update page SEO ─────────────────────────────────────
export async function updatePageSeo(pageSlug, { seoTitle, seoDesc, title }) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  try {
    await prisma.page.update({
      where: { slug: pageSlug },
      data: { seoTitle, seoDesc, title },
    });

    const route = PAGE_ROUTES[pageSlug] ?? `/${pageSlug}`;
    revalidatePath(route);
    return { success: true };
  } catch (err) {
    console.error('[updatePageSeo]', err);
    return { error: 'Failed to update SEO' };
  }
}

// ─── List all pages ─────────────────────────────────────
export async function listPages() {
  return prisma.page.findMany({
    orderBy: { slug: 'asc' },
    include: { _count: { select: { sections: true } } },
  });
}
