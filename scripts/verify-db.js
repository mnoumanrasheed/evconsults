const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.findMany({
    orderBy: { slug: 'asc' },
    include: { _count: { select: { sections: true } } },
  });
  console.log('CMS Pages:', pages.map((p) => `${p.slug} (${p._count.sections} sections)`).join(', '));

  const published = await prisma.blogPost.count({ where: { status: 'PUBLISHED' } });
  const drafts = await prisma.blogPost.count({ where: { status: 'DRAFT' } });
  console.log(`Blog posts: ${published} published, ${drafts} drafts`);

  const settings = await prisma.globalSetting.findMany({ select: { key: true } });
  console.log('Global settings:', settings.map((s) => s.key).join(', '));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
