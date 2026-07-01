import prisma from '@/lib/prisma';
import ContactClient from './ContactClient';

export const revalidate = 0;

export async function generateMetadata() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'contact' },
    });
    return {
      title: page?.seoTitle || 'Contact Us | EVConsults',
      description:
        page?.seoDesc ||
        'Contact EVConsults for expert advice on EV charging stations, feasibility reports, utility load approvals, and NEPRA registration in Pakistan.',
    };
  } catch {
    return {
      title: 'Contact Us | EVConsults',
      description:
        'Contact EVConsults for expert advice on EV charging stations, feasibility reports, utility load approvals, and NEPRA registration in Pakistan.',
    };
  }
}

export default async function Contact() {
  let contactData = {
    email: 'alviaatif@hotmail.com',
    phone1: '0322 5131504',
    phone2: '0332 8271005',
    whatsapp1: '923225131504',
    whatsapp2: '923328271005',
  };

  let header = {
    title: 'Contact EVConsults',
    subtitle:
      'Planning to set up an EV charging station in Pakistan? Share your details and our team will contact you for a premium consultation.',
  };

  try {
    const [contactSetting, page] = await Promise.all([
      prisma.globalSetting.findUnique({ where: { key: 'contact' } }),
      prisma.page.findUnique({
        where: { slug: 'contact' },
        include: { sections: true },
      }),
    ]);

    if (contactSetting?.value) {
      contactData = { ...contactData, ...contactSetting.value };
    }

    if (page?.sections) {
      const headerSection = page.sections.find((s) => s.key === 'header');
      if (headerSection?.content) {
        header = { ...header, ...headerSection.content };
      }
    }
  } catch (err) {
    console.warn('[Contact] database fetch failed, using fallback defaults.');
  }

  return (
    <>
      <section
        style={{
          position: 'relative',
          padding: 'clamp(7rem, 15vw, 10rem) 0 clamp(3rem, 6vw, 6rem)',
          background:
            'linear-gradient(rgba(4, 13, 26, 0.85), rgba(11, 31, 51, 0.95)), url(/clean_energy_city.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(0, 174, 239, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-50%',
            right: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(57, 211, 83, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            zIndex: 0,
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ animation: 'fadeInUp 0.6s ease' }}>
            <h1
              style={{
                color: 'white',
                marginBottom: '1.5rem',
                textShadow: '0 4px 12px rgba(0,0,0,0.5)',
              }}
            >
              {header.title}
            </h1>
            <p
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                color: 'rgba(255,255,255,0.9)',
                maxWidth: '800px',
                margin: '0 auto',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {header.subtitle}
            </p>
          </div>
        </div>
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </section>

      <ContactClient contactSettings={contactData} />
    </>
  );
}
