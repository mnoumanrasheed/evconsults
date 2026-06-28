import prisma from '@/lib/prisma';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';

export const revalidate = 0; // Dynamic server rendering

// Page SEO Metadata
export async function generateMetadata() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'industries' }
    });
    return {
      title: page?.seoTitle || 'Industries We Serve | EVConsults',
      description: page?.seoDesc || 'EV charging infrastructure solutions tailored for petrol pumps, housing societies, shopping malls, highways, hotels, fleets, and commercial sites in Pakistan.',
    };
  } catch (err) {
    return {
      title: 'Industries We Serve | EVConsults',
      description: 'EV charging infrastructure solutions tailored for petrol pumps, housing societies, shopping malls, highways, hotels, fleets, and commercial sites in Pakistan.',
    };
  }
}

const renderIcon = (name) => {
  const IconComponent = LucideIcons[name] || LucideIcons.Building;
  return <IconComponent size={20} />;
};

export default async function Industries() {
  let page = null;
  try {
    page = await prisma.page.findUnique({
      where: { slug: 'industries' },
      include: { sections: true }
    });
  } catch (err) {
    console.warn('[Industries] database fetch failed, using fallback static data.');
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
      if (Array.isArray(val.industries)) return val.industries;
    }
    return fallback;
  };

  const header = sections.header || { 
    title: "EV Charging Solutions for Every Business Segment", 
    subtitle: "Whether adding an amenity, attracting customers, or building a dedicated EV business — EVConsults delivers the right solution." 
  };

  const indSec = sections.industries_list || {};
  const industriesList = ensureArray(indSec.items || indSec, [
    {
      iconName: "Fuel",
      title: "Petrol Pumps & Fuel Stations",
      desc: "Add DC Fast Chargers to fuel stations to secure high margins, capture long-distance travelers, and future-proof fuel businesses.",
      color: "#39D353"
    },
    {
      iconName: "Building2",
      title: "Housing Societies & Townships",
      desc: "Provide charging as a premium amenity for residents, increasing property valuation and attracting EV-owning tenants.",
      color: "#00AEEF"
    },
    {
      iconName: "ShoppingBag",
      title: "Shopping Malls & Retail Hubs",
      desc: "Increase customer stay time and generate auxiliary revenue by offering parking bay charging for shoppers.",
      color: "#8B5CF6"
    },
    {
      iconName: "Hotel",
      title: "Hotels & Restaurants",
      desc: "Attract premium guests by providing overnight destination charging facilities, placing your site on EV route planners.",
      color: "#EC4899"
    },
    {
      iconName: "Truck",
      title: "Commercial Fleets & Logistics",
      desc: "Optimize logistics operations by planning dedicated depot chargers to transition commercial delivery fleets to electric.",
      color: "#F59E0B"
    },
    {
      iconName: "Milestone",
      title: "Motorways & Highway Stopovers",
      desc: "Deploy ultra-fast charging along major corridors (M2, M9) to cater to inter-city EV passenger transport and logistics.",
      color: "#10B981"
    }
  ]);

  const ctaSec = sections.cta || {};
  const cta = {
    title: ctaSec.title || "Ready to Launch Your EV Charging Station?",
    subtitle: ctaSec.subtitle || ctaSec.description || "Book a free consultation and we'll guide you through every step — from feasibility to commissioning."
  };

  return (
    <>
      {/* Hero Section */}
      <section style={{ 
        position:'relative', 
        padding:'9rem 0 5.5rem', 
        background:'linear-gradient(135deg,rgba(4,13,26,0.92) 0%,rgba(11,31,51,0.96) 100%), url(/clean_energy_city.png)', 
        backgroundSize:'cover', 
        backgroundPosition:'center', 
        color:'white', 
        textAlign:'center', 
        overflow:'hidden' 
      }}>
        <div style={{ position:'absolute', top:'-60px', left:'-60px', width:'450px', height:'450px', background:'radial-gradient(circle,rgba(0,174,239,0.12) 0%,transparent 70%)', borderRadius:'50%' }} />
        <div style={{ position:'absolute', bottom:'-60px', right:'-60px', width:'400px', height:'400px', background:'radial-gradient(circle,rgba(57,211,83,0.1) 0%,transparent 70%)', borderRadius:'50%' }} />
        
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <div style={{ maxWidth:'760px', margin:'0 auto', animation: 'fadeInUp 0.6s ease' }}>
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
              <LucideIcons.Zap size={11} fill="#39D353"/> Industries We Serve
            </span>
            <h1 style={{ color:'white', fontSize:'clamp(2rem,4.5vw,3.2rem)', fontWeight:'900', marginBottom:'1.25rem', lineHeight:1.1, letterSpacing:'-0.02em' }}>
              {header.title}
            </h1>
            <p style={{ fontSize:'1.1rem', color:'rgba(255,255,255,0.7)', maxWidth:'620px', margin:'0 auto', lineHeight:1.7 }}>
              {header.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Industry Cards Grid */}
      <section className="section" style={{ background:'#F8FAFC' }}>
        <div className="container">
          <div style={{ animation: 'fadeInUp 0.6s ease' }}>
            <div style={{ textAlign:'center', marginBottom:'3rem' }}>
              <span style={{ display:'inline-block', background:'rgba(0,174,239,0.1)', color:'#00AEEF', border:'1px solid rgba(0,174,239,0.3)', borderRadius:'2rem', padding:'0.3rem 1rem', fontSize:'0.72rem', fontWeight:'700', letterSpacing:'2px', textTransform:'uppercase', marginBottom:'0.75rem' }}>Who We Help</span>
              <h2 style={{ marginBottom:'0.5rem' }}>Industries We Work With</h2>
              <p style={{ color:'var(--color-text-light)', maxWidth:'560px', margin:'0 auto' }}>From petrol pump owners to highway developers — we guide every investor through the full EV setup process.</p>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))', gap:'1rem' }}>
              {industriesList.map((ind, i) => {
                const accentColor = ind.color || '#00AEEF';
                return (
                  <div 
                    key={i} 
                    className="industry-card"
                    style={{ 
                      background:'white', 
                      borderRadius:'14px', 
                      border:'1px solid #EEF1F5', 
                      padding:'1.5rem', 
                      boxShadow:'0 1px 6px rgba(0,0,0,0.05)', 
                      transition:'all 0.3s', 
                      display:'flex', 
                      flexDirection:'column', 
                      gap:'0.85rem',
                      animation: `fadeInUp 0.5s ease ${i * 0.05}s both`
                    }}
                  >
                    {/* Icon */}
                    <div style={{ 
                      width:'46px', 
                      height:'46px', 
                      borderRadius:'12px', 
                      background:`${accentColor}15`, 
                      border:`1px solid ${accentColor}30`, 
                      display:'flex', 
                      alignItems:'center', 
                      justifyContent:'center', 
                      color: accentColor, 
                      flexShrink:0 
                    }}>
                      {renderIcon(ind.iconName)}
                    </div>
                    {/* Content */}
                    <div>
                      <h4 style={{ fontSize:'0.95rem', fontWeight:'700', color:'#0B1F33', marginBottom:'0.35rem' }}>{ind.title}</h4>
                      <p style={{ fontSize:'0.82rem', color:'var(--color-text-light)', lineHeight:1.6, margin:0 }}>{ind.desc}</p>
                    </div>
                    {/* Learn more */}
                    <Link href="/contact" style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', fontSize:'0.78rem', fontWeight:'700', color: accentColor, textDecoration:'none', marginTop:'auto' }}>
                      Get Advice <LucideIcons.ArrowRight size={12}/>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Pre-footer CTA */}
      <section style={{ background:'white', padding:'4rem 0', textAlign:'center' }}>
        <div className="container">
          <div style={{ 
            background:'linear-gradient(135deg,#040D1A,#0B1F33)', 
            borderRadius:'20px', 
            padding:'3.5rem 2rem', 
            maxWidth:'800px', 
            margin:'0 auto', 
            position:'relative', 
            overflow:'hidden',
            animation: 'fadeInUp 0.7s ease'
          }}>
            <div style={{ position:'absolute', top:'-40px', left:'-40px', width:'200px', height:'200px', borderRadius:'50%', background:'radial-gradient(circle,rgba(0,174,239,0.2) 0%,transparent 70%)' }} />
            <div style={{ position:'absolute', bottom:'-40px', right:'-40px', width:'200px', height:'200px', borderRadius:'50%', background:'radial-gradient(circle,rgba(57,211,83,0.2) 0%,transparent 70%)' }} />
            <div style={{ position:'relative', zIndex:1 }}>
              <h2 style={{ color:'white', marginBottom:'0.75rem', fontSize:'1.8rem' }}>{cta.title}</h2>
              <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'1rem', marginBottom:'1.75rem', maxWidth:'500px', margin:'0 auto 1.75rem' }}>{cta.subtitle}</p>
              <Link href="/contact" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.9rem 2rem', background:'linear-gradient(135deg,#39D353,#2ab83f)', color:'#040D1A', fontWeight:'800', borderRadius:'50px', fontSize:'0.97rem', textDecoration:'none', boxShadow:'0 0 28px rgba(57,211,83,0.35)' }}>
                Book Free Consultation <LucideIcons.ArrowRight size={15}/>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .industry-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 36px rgba(0,0,0,0.1) !important;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
