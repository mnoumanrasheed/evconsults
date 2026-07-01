import { z } from 'zod';

// ─── Auth ──────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// ─── Blog Post ─────────────────────────────────────────
export const blogPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'),
  excerpt: z.string().optional().or(z.literal('')),
  body: z.string().min(10, 'Body content is required'),
  category: z.string().min(2, 'Category is required'),
  image: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || val.startsWith('/') || z.string().url().safeParse(val).success,
      'Image must be a valid URL or site path starting with /'
    ),
  imageAlt: z.string().optional(),
  readTime: z.string().optional(),
  accent: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
});

// ─── Section Content ────────────────────────────────────
export const sectionSchema = z.object({
  pageId: z.string().cuid(),
  key: z.string().min(1),
  content: z.any(), // JSON content varies per section type
});

// ─── Contact Form ───────────────────────────────────────
export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  company: z.string().optional(),
  phone: z.string().min(7, 'Valid phone number required'),
  email: z.string().email('Valid email required'),
  city: z.string().min(2, 'City is required'),
  siteType: z.string().min(2),
  load: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// ─── Global Setting ─────────────────────────────────────
export const globalSettingSchema = z.object({
  key: z.string().min(1),
  value: z.any(),
});

// ─── Media ──────────────────────────────────────────────
export const mediaSchema = z.object({
  url: z.string().url('Valid URL required'),
  publicId: z.string().min(1),
  alt: z.string().optional(),
  mimeType: z.string().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  bytes: z.number().int().optional(),
});
