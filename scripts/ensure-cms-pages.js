/**
 * Ensures blog and contact CMS pages exist (safe to run on existing databases).
 * Does not overwrite existing section content.
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function ensurePage(slug, pageData, sections) {
  await prisma.page.upsert({
    where: { slug },
    update: {},
    create: pageData,
  });

  const page = await prisma.page.findUnique({ where: { slug } });

  for (const section of sections) {
    await prisma.section.upsert({
      where: { pageId_key: { pageId: page.id, key: section.key } },
      update: {},
      create: { pageId: page.id, ...section },
    });
  }

  console.log(`✓ Ensured page: ${slug}`);
}

async function main() {
  await ensurePage(
    'contact',
    {
      slug: 'contact',
      title: 'Contact',
      seoTitle: 'Contact Us | EVConsults',
      seoDesc:
        'Contact EVConsults for expert advice on EV charging stations, feasibility reports, utility load approvals, and NEPRA registration in Pakistan.',
    },
    [
      {
        key: 'header',
        order: 1,
        content: {
          title: 'Contact EVConsults',
          subtitle:
            'Planning to set up an EV charging station in Pakistan? Share your details and our team will contact you for a premium consultation.',
        },
      },
    ]
  );

  await ensurePage(
    'blog',
    {
      slug: 'blog',
      title: 'Blog',
      seoTitle: 'EV Insights & Industry Intelligence | EVConsults',
      seoDesc:
        "Expert analysis, regulatory updates, and practical guides for Pakistan's fast-growing electric vehicle charging sector.",
    },
    [
      {
        key: 'header',
        order: 1,
        content: {
          tag: 'Knowledge Hub',
          title: 'EV Insights & Industry Intelligence',
          subtitle:
            "Expert analysis, regulatory updates, and practical guides for Pakistan's fast-growing electric vehicle charging sector.",
        },
      },
      {
        key: 'cta',
        order: 2,
        content: {
          title: 'Have a Project in Mind?',
          subtitle: 'Our consultants are ready to guide you through feasibility, licensing, and implementation.',
          buttonText: 'Book a Free Consultation',
        },
      },
    ]
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
