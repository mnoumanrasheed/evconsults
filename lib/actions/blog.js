'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { blogPostSchema } from '@/lib/validations';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ─── List all blog posts ─────────────────────────────────
export async function listBlogPosts() {
  return prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, title: true, slug: true, category: true,
      status: true, createdAt: true, publishedAt: true,
      excerpt: true, image: true, accent: true,
    },
  });
}

// ─── Get published posts (public) ───────────────────────
export async function getPublishedPosts() {
  return prisma.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true, title: true, slug: true, category: true,
      excerpt: true, image: true, imageAlt: true,
      readTime: true, accent: true, publishedAt: true,
    },
  });
}

// ─── Get single post by slug (public) ───────────────────
export async function getPostBySlug(slug) {
  return prisma.blogPost.findUnique({
    where: { slug, status: 'PUBLISHED' },
  });
}

// ─── Get post by id (admin) ──────────────────────────────
export async function getPostById(id) {
  return prisma.blogPost.findUnique({ where: { id } });
}

// ─── Create blog post ────────────────────────────────────
export async function createBlogPost(data) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') return { error: 'Unauthorized' };

  const parsed = blogPostSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  try {
    const slug = data.slug || slugify(data.title);

    // Ensure unique slug
    const exists = await prisma.blogPost.findUnique({ where: { slug } });
    if (exists) return { error: 'A post with this slug already exists' };

    const post = await prisma.blogPost.create({
      data: {
        ...parsed.data,
        slug,
        publishedAt: parsed.data.status === 'PUBLISHED' ? new Date() : null,
      },
    });

    revalidatePath('/blog');
    revalidatePath('/admin/blog');
    return { success: true, post };
  } catch (err) {
    console.error('[createBlogPost]', err);
    return { error: 'Failed to create post' };
  }
}

// ─── Update blog post ────────────────────────────────────
export async function updateBlogPost(id, data) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') return { error: 'Unauthorized' };

  const parsed = blogPostSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return { error: 'Post not found' };

    // Check slug uniqueness (only if changed)
    if (parsed.data.slug !== existing.slug) {
      const conflict = await prisma.blogPost.findUnique({ where: { slug: parsed.data.slug } });
      if (conflict) return { error: 'Slug already in use' };
    }

    const publishedAt =
      parsed.data.status === 'PUBLISHED' && !existing.publishedAt
        ? new Date()
        : existing.publishedAt;

    const post = await prisma.blogPost.update({
      where: { id },
      data: { ...parsed.data, publishedAt },
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    if (existing.slug !== post.slug) revalidatePath(`/blog/${existing.slug}`);
    revalidatePath('/admin/blog');

    return { success: true, post };
  } catch (err) {
    console.error('[updateBlogPost]', err);
    return { error: 'Failed to update post' };
  }
}

// ─── Delete blog post ────────────────────────────────────
export async function deleteBlogPost(id) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') return { error: 'Unauthorized' };

  try {
    const post = await prisma.blogPost.delete({ where: { id } });
    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath('/admin/blog');
    return { success: true };
  } catch (err) {
    console.error('[deleteBlogPost]', err);
    return { error: 'Failed to delete post' };
  }
}

// ─── Slug generator helper ────────────────────────────────
export async function generateSlug(title) {
  return slugify(title);
}
