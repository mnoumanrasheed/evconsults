import prisma from '@/lib/prisma';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';

export const revalidate = 0; // Dynamic server rendering

// Page SEO Metadata
export async function generateMetadata() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'licensing' }
    });
    return {
      title: page?.seoTitle || 'Licensing & Regulatory Compliance | EVConsults',
      description: page?.seoDesc || 'Complete guidance on EV charging station licensing, NEPRA registration, and DISCO coordination in Pakistan.',
    };
  } catch (err) {
    return {
      title: 'Licensing & Regulatory Compliance | EVConsults',
      description: 'Complete guidance on EV charging station licensing, NEPRA registration, and DISCO coordination in Pakistan.',
    };
  }
}

const renderIcon = (name) => {
  const IconComponent = LucideIcons[name] || LucideIcons.FileText;
  return <IconComponent size={20} />;
};

export default async function Licensing() {
  let page = null;
  try {
    page = await prisma.page.findUnique({
      where: { slug: 'licensing' },
      include: { sections: true }
    });
  } catch (err) {
    console.warn('[Licensing] database fetch failed, using fallback static data.');
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
      if (Array.isArray(val.areas)) return val.areas;
    }
    return fallback;
  };

  const header = sections.header || { 
    title: "EV Charging Station Licensing & Registration in Pakistan", 
    subtitle: "Investors must consider regulatory requirements, electricity connection, technical standards, site safety, and documentation compliance before launching." 
  };

  const requirementsSec = sections.requirements || sections.areas || {};
  const areas = ensureArray(requirementsSec.items || requirementsSec, [
    {
      iconName: "FileText",
      title: "NEPRA Licensing & Registration",
      desc: "Under NEPRA regulations, EV charging station operators are required to register their facility. EVConsults manages all aspects of application preparation, submission, and follow-up.",
      color: "#00AEEF"
    },
    {
      iconName: "Zap",
      title: "Utility Load approvals (DISCOs)",
      desc: "Securing the required grid load from distribution companies (like K-Electric, LESCO, IESCO, etc.) is a major step. We manage the application process, load demand calculations, and sub-station design audits.",
      color: "#39D353"
    },
    {
      iconName: "Shield",
      title: "Electrical & Fire Safety Audits",
      desc: "We verify that the station design, equipment selection, grounding/earthing configurations, and cabling comply with national and international standard safety guidelines.",
      color: "#F59E0B"
    }
  ]);

  const whyChooseUsSec = sections.why_choose_us || {};
  const whyChooseUs = {
    title: whyChooseUsSec.title || "Why Choose EVConsults?",
    items: ensureArray(whyChooseUsSec.items || whyChooseUsSec.points, [
      "Pakistan-specific NEPRA licensing guidance",
      "Complete documentation checklist & support",
      "DISCO coordination & load application assistance",
      "Technical compliance verification",
      "Vendor-neutral charger specification advice",
      "End-to-end project documentation"
    ])
  };

  const ctaSec = sections.cta || {};
  const cta = {
    title: ctaSec.title || "Need Licensing Support?",
    description: ctaSec.description || "Get professional documentation and regulatory guidance from Pakistan's leading EV consultants."
  };

  return (
    <>
      {/* Hero Section */}
      <section style={{ 
        position:'relative', 
        padding:'clamp(6rem,14vw,9rem) 0 clamp(3rem,6vw,6rem)', 
        background:'linear-gradient(135deg,rgba(4,13,26,0.92) 0%,rgba(11,31,51,0.96) 100%), url(/ev_charging_hero.png)', 
        backgroundSize:'cover', 
        backgroundPosition:'center', 
        color:'white', 
        textAlign:'center', 
        overflow:'hidden' 
      }}>
        <div style={{ position:'absolute', top:'-60px', left:'-60px', width:'450px', height:'450px', background:'radial-gradient(circle,rgba(0,174,239,0.12) 0%,transparent 70%)', borderRadius:'50%' }} />
        <div style={{ position:'absolute', bottom:'-60px', right:'-60px', width:'400px', height:'400px', background:'radial-gradient(circle,rgba(57,211,83,0.1) 0%,transparent 70%)', borderRadius:'50%' }} />
        
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <div style={{ maxWidth:'780px', margin:'0 auto', animation: 'fadeInUp 0.6s ease' }}>
            <span style={{ 
              display:'inline-flex', 
              alignItems:'center', 
              gap:'0.4rem', 
              padding:'0.4rem 1.1rem', 
              background:'rgba(57,211,83,0.12)', 
              border:'1px solid rgba(57,211,83,0.3)', 
              color:'#39D353', 
              borderRadius:'2rem', 
              fontSize:'0.75rem', 
              fontWeight:'700', 
              letterSpacing:'2px', 
              textTransform:'uppercase', 
              marginBottom:'1.5rem' 
            }}>
              <LucideIcons.Zap size={11} fill="#39D353"/> Licensing &amp; Regulatory
            </span>
            <h1 style={{ color:'white', fontSize:'clamp(1.8rem,4.5vw,3.4rem)', fontWeight:'900', marginBottom:'1.25rem', lineHeight:1.1, letterSpacing:'-0.02em' }}>
              {header.title}
            </h1>
            <p style={{ fontSize:'clamp(0.95rem,2vw,1.1rem)', color:'rgba(255,255,255,0.7)', maxWidth:'640px', margin:'0 auto', lineHeight:1.7 }}>
              {header.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="section">
        <div className="container">
          <div className="licensing-layout">

            {/* Left: Requirements Steps */}
            <div>
              <div style={{ animation: 'fadeInUp 0.6s ease' }}>
                <div style={{ marginBottom:'2.5rem' }}>
                  <span style={{ display:'inline-block', background:'rgba(0,174,239,0.1)', color:'#00AEEF', border:'1px solid rgba(0,174,239,0.3)', borderRadius:'2rem', padding:'0.3rem 1rem', fontSize:'0.72rem', fontWeight:'700', letterSpacing:'2px', textTransform:'uppercase', marginBottom:'0.75rem' }}>Key Requirements</span>
                  <h2 style={{ marginBottom:'0.5rem' }}>Important Areas to Consider</h2>
                  <p style={{ color:'var(--color-text-light)', margin:0 }}>A structured overview of every critical area you need to address before going live.</p>
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
                  {areas.map((area, i) => {
                    const stepColor = area.color || '#00AEEF';
                    return (
                      <div 
                        key={i}
                        className="licensing-card"
                        style={{ 
                          display:'flex', 
                          gap:'1rem', 
                          alignItems:'flex-start', 
                          padding:'1.2rem 1.4rem', 
                          borderRadius:'12px', 
                          background:'white', 
                          boxShadow:'0 1px 6px rgba(0,0,0,0.05)', 
                          border:'1px solid #EEF1F5', 
                          borderLeft:`3px solid ${stepColor}`, 
                          transition:'all 0.25s',
                          animation: `fadeInLeft 0.5s ease ${i * 0.05}s both`
                        }}
                      >
                        <div style={{ 
                          width:'40px', 
                          height:'40px', 
                          borderRadius:'10px', 
                          background:`${stepColor}15`, 
                          border:`1px solid ${stepColor}30`, 
                          display:'flex', 
                          alignItems:'center', 
                          justifyContent:'center', 
                          color: stepColor, 
                          flexShrink:0 
                        }}>
                          {renderIcon(area.iconName)}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.25rem', flexWrap:'wrap' }}>
                            <span style={{ fontSize:'0.7rem', fontWeight:'700', color: stepColor, background:`${stepColor}12`, padding:'0.15rem 0.5rem', borderRadius:'1rem', letterSpacing:'1px', textTransform:'uppercase' }}>Step {i+1}</span>
                            <h4 style={{ margin:0, fontSize:'0.97rem', fontWeight:'700', color:'#0B1F33' }}>{area.title}</h4>
                          </div>
                          <p style={{ margin:0, fontSize:'0.86rem', color:'var(--color-text-light)', lineHeight:1.6 }}>{area.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Sticky Sidebar */}
            <div className="licensing-sidebar" style={{ animation: 'fadeInUp 0.7s ease' }}>
              <div style={{ borderRadius:'16px', overflow:'hidden', boxShadow:'0 20px 50px rgba(0,0,0,0.12)', border:'1px solid #EEF1F5' }}>
                <img src="/ev_charging_business.png" alt="NEPRA Licensing Pakistan" style={{ width:'100%', height:'200px', objectFit:'cover', display:'block' }}/>
                <div style={{ padding:'1.5rem', background:'white' }}>
                  <h3 style={{ fontSize:'1.05rem', marginBottom:'1rem', color:'#0B1F33', fontWeight: 700 }}>{whyChooseUs.title}</h3>
                  <ul style={{ display:'flex', flexDirection:'column', gap:'0.6rem', padding:0, listStyle:'none', margin:0 }}>
                    {whyChooseUs.items.map((pt, i) => (
                      <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:'0.6rem', fontSize:'0.86rem', color:'var(--color-text-light)' }}>
                        <LucideIcons.CheckCircle size={15} style={{ color:'#39D353', flexShrink:0, marginTop:'2px' }}/>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA card */}
              <div style={{ 
                borderRadius:'16px', 
                background:'linear-gradient(135deg,#040D1A,#0B1F33)', 
                padding:'1.8rem', 
                position:'relative', 
                overflow:'hidden', 
                marginTop:'1.5rem' 
              }}>
                <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'150px', height:'150px', borderRadius:'50%', background:'radial-gradient(circle,rgba(57,211,83,0.2) 0%,transparent 70%)' }} />
                <div style={{ position:'relative', zIndex:1 }}>
                  <LucideIcons.Zap size={28} color="#39D353" fill="#39D353" style={{ marginBottom:'0.75rem' }} />
                  <h3 style={{ color:'white', fontSize:'1.05rem', marginBottom:'0.6rem', fontWeight: 700 }}>{cta.title}</h3>
                  <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.86rem', marginBottom:'1.25rem', lineHeight:1.6 }}>{cta.description}</p>
                  <Link href="/contact" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.75rem 1.5rem', background:'linear-gradient(135deg,#39D353,#2ab83f)', color:'#040D1A', fontWeight:'700', borderRadius:'50px', fontSize:'0.9rem', textDecoration:'none' }}>
                    Request Support <LucideIcons.ArrowRight size={15}/>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

        <style>{`
          .licensing-layout {
            display: grid;
            grid-template-columns: 1fr;
            gap: 3rem;
            align-items: flex-start;
          }
          .licensing-sidebar {
            order: -1;
          }
          .licensing-card:hover {
            transform: translateX(4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important;
          }
          @media (min-width: 900px) {
            .licensing-layout {
              grid-template-columns: 1fr 380px;
              gap: 4rem;
            }
            .licensing-sidebar {
              order: 0;
              position: sticky;
              top: 100px;
            }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInLeft {
            from { opacity: 0; transform: translateX(-16px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </section>
    </>
  );
}
