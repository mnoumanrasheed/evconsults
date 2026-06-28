import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Target, Eye, ShieldCheck } from 'lucide-react';

export const revalidate = 0; // Dynamic server rendering

// Page SEO Metadata
export async function generateMetadata() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'about' }
    });
    return {
      title: page?.seoTitle || 'About Us | EVConsults',
      description: page?.seoDesc || 'Pakistan\'s trusted advisory platform for EV charging infrastructure development.',
    };
  } catch (err) {
    return {
      title: 'About Us | EVConsults',
      description: 'Pakistan\'s trusted advisory platform for EV charging infrastructure development.',
    };
  }
}

export default async function About() {
  let page = null;
  try {
    page = await prisma.page.findUnique({
      where: { slug: 'about' },
      include: { sections: true }
    });
  } catch (err) {
    console.warn('[About] database fetch failed, using fallback static data.');
  }

  // Helper to extract section content
  const sections = {};
  if (page && page.sections) {
    page.sections.forEach(sec => {
      sections[sec.key] = sec.content;
    });
  }

  const ensureArray = (val, fallback) => {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') {
      if (Array.isArray(val.items)) return val.items;
      if (Array.isArray(val.points)) return val.points;
      if (Array.isArray(val.paragraphs)) return val.paragraphs;
    }
    return fallback;
  };

  const header = sections.header || { 
    title: "About EVConsults", 
    subtitle: "Pakistan's trusted advisory platform for EV charging infrastructure development." 
  };
  const whoWeAre = sections.who_we_are || { 
    title: "Who We Are", 
    paragraphs: [
      "EVConsults is a Pakistan-focused consultancy platform created to support the development of electric vehicle charging infrastructure. We help investors, businesses, property owners, petrol pumps, housing societies, and fleet operators understand the technical, regulatory, financial, and operational requirements for setting up EV charging stations.",
      "Our objective is to make EV charging station development easier, safer, legally compliant, and commercially viable."
    ] 
  };
  const missionVision = sections.mission_vision || {
    mission: "To accelerate Pakistan's transition toward clean mobility by providing professional consultancy.",
    vision: "To become Pakistan's trusted advisory platform for EV charging station planning and implementation."
  };
  const values = sections.values || {
    title: "Our Core Values",
    subtitle: "The principles that guide our consultancy and ensure your EV project's success.",
    items: ["Professionalism", "Transparency", "Technical accuracy", "Regulatory compliance", "Commercial practicality", "Sustainability"]
  };
  const cta = sections.cta || {
    title: "Ready to Power the Future?",
    description: "Join Pakistan's EV revolution. Get end-to-end guidance on setting up a profitable, compliant, and state-of-the-art charging infrastructure."
  };

  const whoWeAreParagraphs = ensureArray(whoWeAre.paragraphs, []);
  const valuesItems = ensureArray(values.items, []);

  return (
    <>
      {/* Header Section */}
      <section style={{ 
        position: 'relative', 
        padding: 'clamp(6rem,14vw,10rem) 0 clamp(3rem,6vw,6rem)', 
        background: 'linear-gradient(rgba(4, 13, 26, 0.85), rgba(11, 31, 51, 0.95)), url(/ev_charging_hero.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textAlign: 'center',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0, 174, 239, 0.15) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(57, 211, 83, 0.1) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ animation: 'fadeInUp 0.6s ease' }}>
            <h1 style={{ color: 'white', marginBottom: '1.5rem', fontSize: 'clamp(1.8rem,5vw,3rem)' }}>{header.title}</h1>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', maxWidth: '800px', margin: '0 auto' }}>
              {header.subtitle}
            </p>
          </div>
        </div>
      </section>
 
      {/* Who We Are & Mission/Vision */}
      <section className="section">
        <div className="container">
          <div className="about-two-col" style={{ gap: '3rem', alignItems: 'center' }}>
            <div style={{ animation: 'fadeInUp 0.7s ease' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>{whoWeAre.title}</h2>
              {whoWeAreParagraphs.map((p, idx) => (
                <p key={idx} style={{ fontSize: '1.1rem', marginBottom: idx === whoWeAreParagraphs.length - 1 ? '2rem' : '1.5rem' }}>
                  {p}
                </p>
              ))}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <div className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1.5rem' }}>
                  <Target size={40} style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', marginBottom: '0.25rem' }}>Our Mission</h3>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>{missionVision.mission}</p>
                  </div>
                </div>
                <div className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1.5rem' }}>
                  <Eye size={40} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', marginBottom: '0.25rem' }}>Our Vision</h3>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>{missionVision.vision}</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ 
              position: 'relative', 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden', 
              boxShadow: 'var(--shadow-lg)', 
              height: 'clamp(280px,50vw,500px)',
              animation: 'scaleIn 0.8s ease'
            }}>
              <img 
                src="/ev_charging_hero.png" 
                alt="Modern EV Charging Station" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="section section-bg-light" style={{ paddingBottom: '2rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'fadeInUp 0.6s ease' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>{values.title}</h2>
            <p style={{ color: 'var(--color-text-light)', maxWidth: '600px', margin: '0 auto' }}>{values.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3" style={{ gap: '1.5rem' }}>
            {valuesItems.map((valName, i) => (
              <div 
                key={i}
                className="card" 
                style={{ 
                  textAlign: 'center', 
                  padding: '1.5rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  minHeight: '160px',
                  animation: `fadeInUp 0.5s ease ${i * 0.05}s both`
                }}
              >
                <div style={{ background: 'rgba(57, 211, 83, 0.1)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <ShieldCheck size={24} style={{ color: 'var(--color-secondary)' }} />
                </div>
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '700' }}>{valName}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-footer CTA */}
      <section style={{ padding: '4rem 0 7rem', background: 'var(--color-light-grey)' }}>
        <div className="container">
          <div style={{ 
            background: 'linear-gradient(135deg, #040D1A 0%, #0B1F33 100%)', 
            borderRadius: '28px', 
            padding: '5rem 2rem', 
            textAlign: 'center', 
            border: '1px solid rgba(255,255,255,0.08)', 
            position: 'relative', 
            overflow: 'hidden', 
            boxShadow: '0 30px 60px -12px rgba(0,0,0,0.45)',
            animation: 'fadeInUp 0.8s ease'
          }}>
            {/* Ambient Background Glows */}
            <div style={{ position: 'absolute', top: '-20%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0, 174, 239, 0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '-20%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(57, 211, 83, 0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ 
                fontSize: 'clamp(2rem, 5vw, 3.2rem)', 
                marginBottom: '1.25rem', 
                color: 'white', 
                fontWeight: '900', 
                letterSpacing: '-1px',
                lineHeight: 1.1
              }}>
                Ready to <span style={{ color: 'var(--color-secondary)' }}>Power the Future?</span>
              </h2>
              <p style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '1.2rem', 
                maxWidth: '650px', 
                margin: '0 auto 3rem auto', 
                lineHeight: '1.8' 
              }}>
                {cta.description}
              </p>
              <Link href="/contact" className="btn" style={{ 
                background: 'var(--color-secondary)',
                color: 'var(--color-primary)',
                padding: '1.25rem 3.5rem', 
                fontSize: '1.1rem', 
                textTransform: 'uppercase', 
                letterSpacing: '2px', 
                fontWeight: '800',
                borderRadius: '50px',
                boxShadow: '0 10px 20px -5px rgba(57, 211, 83, 0.4)',
                transition: 'all 0.3s'
              }}>
                Consult With An Expert
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .about-two-col {
          display: grid;
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .about-two-col {
            grid-template-columns: 1fr 1fr;
          }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
