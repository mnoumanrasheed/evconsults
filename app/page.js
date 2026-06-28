import prisma from '@/lib/prisma';
import HomeClient from './HomeClient';

export const revalidate = 0; // Dynamic server rendering

// Page SEO Metadata
export async function generateMetadata() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'home' }
    });
    return {
      title: page?.seoTitle || 'EV Charging Station Business Consultancy Pakistan | EVConsults',
      description: page?.seoDesc || 'Start your EV charging station business in Pakistan with end-to-end guidance from feasibility study and NEPRA licensing support to final commissioning.',
    };
  } catch (err) {
    return {
      title: 'EV Charging Station Business Consultancy Pakistan | EVConsults',
      description: 'Start your EV charging station business in Pakistan with end-to-end guidance from feasibility study and NEPRA licensing support to final commissioning.',
    };
  }
}

export default async function Home() {
  let page = null;
  try {
    page = await prisma.page.findUnique({
      where: { slug: 'home' },
      include: { sections: true }
    });
  } catch (err) {
    console.warn('[Home] database fetch failed, using fallback static data.');
  }

  // Map sections key -> content
  const sections = {};
  if (page && page.sections) {
    page.sections.forEach(sec => {
      sections[sec.key] = sec.content;
    });
  }

  return <HomeClient pageData={sections} />;
}
