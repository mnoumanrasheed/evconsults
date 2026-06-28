import prisma from '@/lib/prisma';

export default async function sitemap() {
  const base = 'https://www.evconsults.pk';
  const now = new Date();

  // Static core routes
  const routes = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/licensing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/industries`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
  ];

  // Dynamic routes from database
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true }
    });

    posts.forEach(post => {
      routes.push({
        url: `${base}/blog/${post.slug}`,
        lastModified: post.updatedAt || now,
        changeFrequency: 'monthly',
        priority: 0.7
      });
    });
  } catch (err) {
    console.error('[Sitemap] Failed to query dynamic blog posts:', err);
    // fallback static blog posts in case of database timeout during build
    const fallbacks = [
      'start-ev-business-pakistan',
      'ev-license-requirements',
      'cost-setup-ev-charging',
      'ac-vs-dc-chargers',
      'best-locations-ev-charging',
      'ev-business-model-petrol-pumps',
      'ev-charging-housing-societies',
      'ev-opportunity-investors',
      'technical-requirements-ev',
      'ev-feasibility-study'
    ];
    fallbacks.forEach(slug => {
      routes.push({
        url: `${base}/blog/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7
      });
    });
  }

  return routes;
}
