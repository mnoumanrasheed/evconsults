import prisma from '@/lib/prisma';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';

export const revalidate = 0; // Dynamic server rendering

// Page SEO Metadata
export async function generateMetadata() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'services' }
    });
    return {
      title: page?.seoTitle || 'Consultancy Services | EVConsults',
      description: page?.seoDesc || 'EV Charging Station Feasibility, Licensing, and Implementation Consultancy in Pakistan.',
    };
  } catch (err) {
    return {
      title: 'Consultancy Services | EVConsults',
      description: 'EV Charging Station Feasibility, Licensing, and Implementation Consultancy in Pakistan.',
    };
  }
}

const renderIcon = (name) => {
  const IconComponent = LucideIcons[name] || LucideIcons.Zap;
  return <IconComponent size={32} />;
};

export default async function Services() {
  let page = null;
  try {
    page = await prisma.page.findUnique({
      where: { slug: 'services' },
      include: { sections: true }
    });
  } catch (err) {
    console.warn('[Services] database fetch failed, using fallback static data.');
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
      if (Array.isArray(val.services)) return val.services;
    }
    return fallback;
  };

  const header = sections.header || { 
    title: "EV Charging Station Consultancy Services in Pakistan", 
    subtitle: "EVConsults provides professional consultancy services for individuals, companies, petrol pumps, housing societies, malls, fleet operators, and investors planning to establish EV charging stations in Pakistan." 
  };
  const servicesList = ensureArray(sections.services_list, [
    {
      iconName: "BarChart",
      title: "EV Charging Station Feasibility Study",
      desc: "Comprehensive analysis detailing the commercial viability, technical setup, capital expenditures (CAPEX), operating expenses (OPEX), and returns on investment (ROI).",
      points: ["Site selection and accessibility audit", "Electrical load requirements analysis", "CAPEX & OPEX financial modelling", "Projected payback period and ROI", "Risk assessment and mitigation plans"]
    },
    {
      iconName: "Zap",
      title: "NEPRA Licensing & Regulatory Compliance",
      desc: "End-to-end support for obtaining electric vehicle charging station licenses and registrations from the National Electric Power Regulatory Authority (NEPRA).",
      points: ["NEPRA licensing documentation preparation", "Regulatory compliance checklists", "Liaison with electric distribution companies", "Safety guidelines compliance verification", "Environmental clearance coordination"]
    },
    {
      iconName: "HardDrive",
      title: "Equipment Selection & Implementation Advisory",
      desc: "Independent technical guidance on selecting optimal charging hardware, software backends, power installations, and grid connections.",
      points: ["Charger specifications (AC vs DC, CCS2)", "CMS software platform evaluation", "Transformer & distribution board setup", "Service level agreement (SLA) reviews", "Installation safety audit protocols"]
    }
  ]);
  const cta = sections.cta || {
    title: "Ready to Start Your EV Charging Project?",
    subtitle: "Get in touch with our experts to discuss your specific requirements."
  };

  return (
    <>
      {/* Header Section */}
      <section style={{ 
        position: 'relative', 
        padding: 'clamp(6rem,14vw,10rem) 0 clamp(3rem,6vw,6rem)', 
        background: 'linear-gradient(rgba(4, 13, 26, 0.85), rgba(11, 31, 51, 0.95)), url(/ev_charging_business.png)',
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
          <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeInUp 0.6s ease' }}>
            <h1 style={{ color: 'white', fontSize: 'clamp(1.6rem,4vw,3rem)', marginBottom: '1.5rem' }}>{header.title}</h1>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)' }}>
              {header.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1" style={{ gap: '3rem' }}>
            {servicesList.map((service, index) => (
              <div 
                key={index} 
                className="card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  padding: '3rem',
                  animation: `fadeInUp 0.6s ease ${index * 0.05}s both`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ 
                    backgroundColor: 'rgba(57, 211, 83, 0.1)', color: 'var(--color-secondary)',
                    padding: '1.25rem', borderRadius: 'var(--radius-lg)', flexShrink: 0
                  }}>
                    {renderIcon(service.iconName)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ marginBottom: '1rem', fontSize: 'clamp(1.2rem,3vw,1.5rem)' }}>{service.title}</h2>
                    <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>{service.desc}</p>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Includes:</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      {(service.points || []).map((point, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <LucideIcons.CheckCircle size={18} style={{ color: 'var(--color-secondary)', flexShrink: 0, marginTop: '0.1rem' }} />
                          <span style={{ fontSize: '0.95rem' }}>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-footer CTA */}
      <section className="section section-bg-light" style={{ textAlign: 'center' }}>
        <div className="container">
          <div style={{ animation: 'fadeInUp 0.6s ease' }}>
            <h2>{cta.title}</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>{cta.subtitle}</p>
            <Link href="/contact" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Book Free Consultation</Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
