'use client';
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";

const fadeUp = { hidden:{ opacity:0, y:30 }, visible:{ opacity:1, y:0, transition:{ duration:0.7, ease:"easeOut" } } };
const stagger = { hidden:{}, visible:{ transition:{ staggerChildren:0.12 } } };



const renderIcon = (name, size = 20) => {
  // Map special names if needed
  let IconName = name;
  if (name === 'HomeIcon') IconName = 'Home';
  
  const IconComponent = LucideIcons[IconName] || LucideIcons.Zap;
  return <IconComponent size={size} />;
};

const ensureArray = (val, fallback) => {
  if (Array.isArray(val)) return val;
  if (val && typeof val === 'object') {
    if (Array.isArray(val.items)) return val.items;
    if (Array.isArray(val.points)) return val.points;
    if (Array.isArray(val.slides)) return val.slides;
  }
  return fallback;
};

export default function HomeClient({ pageData = {} }) {
  const SLIDES = ensureArray(pageData.hero_slides, [
    { bg: "/ev_charging_hero.png", tag: "Pakistan's #1 EV Consultancy", headline: "Start Your EV Charging\nStation Business", sub: "End-to-end consultancy from feasibility to commissioning — designed for Pakistan." },
    { bg: "/ev_charging_business.png", tag: "Licensing & Regulatory", headline: "Licensing\nWith Confidence", sub: "We handle every NEPRA document, approval, and coordination so you can focus on growth." },
    { bg: "/clean_energy_city.png", tag: "Financial Modelling", headline: "Data-Driven\nEV Investment", sub: "ROI analysis, CAPEX/OPEX modelling, and payback period forecasts tailored for Pakistan." },
  ]);

  const problemsSec = pageData.problems || pageData.challenges || {};
  const PROBLEMS = ensureArray(problemsSec.items || problemsSec, [
    { title: "Unclear Licensing", text: "Many investors are unsure which approvals and documents are required from NEPRA & DISCOs.", iconName: "FileText", color: "#EF4444" },
    { title: "Grid & Load Issues", text: "A charging station needs proper load assessment and coordination with the relevant utility.", iconName: "Zap", color: "#F59E0B" },
    { title: "Wrong Charger Choice", text: "Selecting AC or DC chargers without demand analysis leads to poor ROI.", iconName: "AlertTriangle", color: "#8B5CF6" },
    { title: "Weak Business Model", text: "Location, tariff, utilization, CAPEX, OPEX, and payback must be properly evaluated.", iconName: "LineChart", color: "#00AEEF" },
    { title: "Safety Compliance", text: "Electrical safety, earthing, protection systems, and commissioning must be addressed.", iconName: "ShieldCheck", color: "#39D353" },
  ]);

  const servicesSec = pageData.services || {};
  const SERVICES = ensureArray(servicesSec.items || servicesSec, [
    "Feasibility Study",
    "NEPRA Licensing Support",
    "Technical Design Review",
    "DISCO / Utility Coordination",
    "Financial Model & ROI Analysis",
    "Charger & Vendor Selection",
    "Site Assessment",
    "Commissioning Support"
  ]);

  const whoSec = pageData.who_we_serve || {};
  const WHO = ensureArray(whoSec.items || whoSec, [
    { title: "Petrol Pumps", text: "Add EV charging as a revenue stream.", iconName: "Fuel", color: "#00AEEF" },
    { title: "Shopping Malls", text: "Attract premium customers.", iconName: "ShoppingBag", color: "#39D353" },
    { title: "Housing Societies", text: "Offer charging to residents.", iconName: "HomeIcon", color: "#8B5CF6" },
    { title: "Hotels & Restaurants", text: "Destination charging for guests.", iconName: "Hotel", color: "#F59E0B" },
    { title: "Fleet Operators", text: "Charging for electric fleets.", iconName: "Truck", color: "#10B981" },
    { title: "Commercial Buildings", text: "Workplace and visitor charging.", iconName: "Building", color: "#EF4444" },
    { title: "Investors", text: "EV charging as infrastructure.", iconName: "User", color: "#0EA5E9" },
    { title: "Highway Rest Areas", text: "Fast-charging for intercity travel.", iconName: "MapPin", color: "#D946EF" },
  ]);

  const whySec = pageData.why_choose_us || {};
  const WHY = {
    tag: whySec.tag || "Why EVConsults",
    title: whySec.title || "Why Choose EVConsults?",
    subtitle: whySec.description || whySec.subtitle || "We help you build a legally compliant, technically sound, and commercially viable EV charging business in Pakistan.",
    items: ensureArray(whySec.points || whySec.items, [
      "Pakistan-focused EV charging advisory",
      "Technical and commercial feasibility",
      "End-to-end documentation guidance",
      "Business model & investment analysis",
      "Vendor-neutral equipment advice",
      "Practical implementation guidance"
    ])
  };

  const ctaSec = pageData.cta || {};
  const CTA = {
    tag: ctaSec.tag || "Get Started Today",
    title: ctaSec.title || "Planning to Set Up an EV Charging Station?",
    description: ctaSec.description || "Speak with EVConsults and get professional guidance before making your investment decision."
  };

  const [slide, setSlide] = useState(0);
  const [dir, setDir] = useState(1);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start","end start"] });
  const bgY = useTransform(scrollYProgress, [0,1], ["0%","25%"]);
  const textY = useTransform(scrollYProgress, [0,1], ["0%","40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0,0.8], [1,0]);

  useEffect(() => {
    const t = setInterval(() => { setDir(1); setSlide(s => (s+1) % SLIDES.length); }, 6000);
    return () => clearInterval(t);
  }, [SLIDES.length]);

  const goTo = (i) => { setDir(i > slide ? 1 : -1); setSlide(i); };
  const prev = () => { setDir(-1); setSlide(s => (s-1+SLIDES.length)%SLIDES.length); };
  const next = () => { setDir(1); setSlide(s => (s+1)%SLIDES.length); };

  const cur = SLIDES[slide];
  const lines = (cur.headline || "").split("\n");

  return (
    <>
      {/* ── HERO ── */}
      <section ref={heroRef} style={{ position:"relative", height:"100vh", minHeight:"600px", overflow:"hidden", display:"flex", alignItems:"center" }}>

        {/* Background slides */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={slide} custom={dir}
            initial={{ opacity:0, scale:1.06, x: dir*40 }}
            animate={{ opacity:1, scale:1, x:0 }}
            exit={{ opacity:0, scale:0.98, x: dir*-40 }}
            transition={{ duration:1.4, ease:[0.76,0,0.24,1] }}
            style={{ position:"absolute", inset:0, backgroundImage:`url(${cur.bg})`, backgroundSize:"cover", backgroundPosition:"center", y:bgY }}
          />
        </AnimatePresence>

        {/* Cinematic overlays */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,rgba(4,13,26,0.7) 0%,rgba(4,13,26,0.55) 40%,rgba(4,13,26,0.85) 100%)" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,rgba(4,13,26,0.6) 0%,transparent 50%,rgba(4,13,26,0.3) 100%)" }} />


        {/* Grid */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(0,174,239,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,174,239,0.03) 1px,transparent 1px)", backgroundSize:"70px 70px" }} />

        {/* Glowing orbs */}
        <motion.div animate={{ scale:[1,1.2,1], opacity:[0.25,0.45,0.25] }} transition={{ duration:5, repeat:Infinity }}
          style={{ position:"absolute", top:"15%", left:"5%", width:"400px", height:"400px", borderRadius:"50%", background:"radial-gradient(circle,rgba(0,174,239,0.15) 0%,transparent 70%)", pointerEvents:"none" }} />
        <motion.div animate={{ scale:[1,1.25,1], opacity:[0.2,0.4,0.2] }} transition={{ duration:6, repeat:Infinity, delay:1.5 }}
          style={{ position:"absolute", bottom:"15%", right:"8%", width:"350px", height:"350px", borderRadius:"50%", background:"radial-gradient(circle,rgba(57,211,83,0.15) 0%,transparent 70%)", pointerEvents:"none" }} />

        {/* Particles */}
        {[...Array(10)].map((_,i) => (
          <motion.div key={i}
            animate={{ y:[0,-25,0], opacity:[0.2,0.7,0.2] }}
            transition={{ duration:3+i*0.4, repeat:Infinity, delay:i*0.35 }}
            style={{ position:"absolute", width: i%2===0?"5px":"3px", height: i%2===0?"5px":"3px", borderRadius:"50%",
              background: i%3===0?"#00AEEF":i%3===1?"#39D353":"rgba(255,255,255,0.4)",
              left:`${8+i*9}%`, top:`${15+(i%5)*14}%`, pointerEvents:"none", boxShadow: i%3===0?"0 0 8px #00AEEF":i%3===1?"0 0 8px #39D353":"none" }} />
        ))}

        {/* Horizontal scan line */}
        <motion.div animate={{ y:["-5vh","105vh"] }} transition={{ duration:5, repeat:Infinity, ease:"linear", repeatDelay:2 }}
          style={{ position:"absolute", left:0, right:0, height:"2px", background:"linear-gradient(90deg,transparent,rgba(57,211,83,0.4),transparent)", pointerEvents:"none" }} />

        {/* Content */}
        <motion.div style={{ y:textY, opacity:heroOpacity, position:"relative", zIndex:5, width:"100%" }}>
          <div className="container">
            <motion.div initial="hidden" animate="visible" variants={stagger} style={{ maxWidth:"860px" }}>

              {/* Tag */}
              <AnimatePresence mode="wait">
                <motion.div key={`tag-${slide}`} initial={{ opacity:0, y:-12, x:-10 }} animate={{ opacity:1, y:0, x:0 }} exit={{ opacity:0, y:8 }} transition={{ duration:0.5 }}
                  style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.45rem 1.2rem", background:"rgba(57,211,83,0.1)", border:"1px solid rgba(57,211,83,0.4)", color:"#39D353", borderRadius:"2rem", fontSize:"0.75rem", fontWeight:"700", letterSpacing:"2.5px", textTransform:"uppercase", marginBottom:"1.8rem" }}>
                  <LucideIcons.Zap size={11} fill="#39D353" />{cur.tag}
                </motion.div>
              </AnimatePresence>

              {/* Headline */}
              <AnimatePresence mode="wait">
                <motion.div key={`h-${slide}`} initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }} transition={{ duration:0.8, ease:[0.76,0,0.24,1] }}>
                  <h1 style={{ color:"white", fontSize:"clamp(2.4rem,5.5vw,4.5rem)", fontWeight:"900", lineHeight:1.05, marginBottom:"1.6rem", textShadow:"0 4px 40px rgba(0,0,0,0.6)", letterSpacing:"-0.02em" }}>
                    {lines.map((line,i) => (
                      <span key={i} style={{ display:"block" }}>
                        {i===1 ? <><span style={{ color:"#39D353" }}>{line}</span></> : line}
                      </span>
                    ))}
                  </h1>
                </motion.div>
              </AnimatePresence>

              {/* Sub */}
              <AnimatePresence mode="wait">
                <motion.p key={`p-${slide}`} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.7, delay:0.15 }}
                  style={{ fontSize:"1.15rem", color:"rgba(255,255,255,0.75)", marginBottom:"2.8rem", maxWidth:"600px", lineHeight:1.75 }}>
                  {cur.sub}
                </motion.p>
              </AnimatePresence>

              {/* CTAs */}
              <motion.div variants={fadeUp} style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
                <Link href="/contact" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.85rem 1.8rem", background:"linear-gradient(135deg,#39D353,#2ab83f)", color:"#040D1A", fontWeight:"800", borderRadius:"50px", fontSize:"0.95rem", textDecoration:"none", boxShadow:"0 0 35px rgba(57,211,83,0.45)", letterSpacing:"0.01em" }}>
                  Book Free Consultation <LucideIcons.ArrowRight size={16}/>
                </Link>
                <Link href="/services" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.85rem 1.8rem", background:"rgba(255,255,255,0.06)", border:"1.5px solid rgba(255,255,255,0.25)", color:"white", fontWeight:"600", borderRadius:"50px", fontSize:"0.95rem", textDecoration:"none" }}>
                  Explore Services
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Slide Controls */}
        <button onClick={prev} style={{ position:"absolute", left:"1.5rem", top:"50%", transform:"translateY(-50%)", zIndex:10, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"50%", width:"48px", height:"48px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"white", transition:"all 0.3s" }}>
          <LucideIcons.ChevronLeft size={20}/>
        </button>
        <button onClick={next} style={{ position:"absolute", right:"1.5rem", top:"50%", transform:"translateY(-50%)", zIndex:10, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"50%", width:"48px", height:"48px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"white", transition:"all 0.3s" }}>
          <LucideIcons.ChevronRight size={20}/>
        </button>

        {/* Slide indicators */}
        <div style={{ position:"absolute", bottom:"2.5rem", left:"50%", transform:"translateX(-50%)", zIndex:10, display:"flex", gap:"0.75rem", alignItems:"center" }}>
          {SLIDES.map((_,i) => (
            <button key={i} onClick={() => goTo(i)} style={{ padding:0, border:"none", background:"none", cursor:"pointer", display:"flex", alignItems:"center" }}>
              <div style={{ height:"3px", borderRadius:"3px", width: i===slide?"36px":"14px", background: i===slide?"#39D353":"rgba(255,255,255,0.3)", transition:"all 0.4s ease", boxShadow: i===slide?"0 0 10px rgba(57,211,83,0.6)":"none" }} />
            </button>
          ))}
        </div>

        {/* Slide counter */}
        <div style={{ position:"absolute", bottom:"2.5rem", right:"2rem", zIndex:10, fontSize:"0.75rem", fontWeight:"700", color:"rgba(255,255,255,0.4)", letterSpacing:"2px", fontFamily:"monospace" }}>
          0{slide+1} / 0{SLIDES.length}
        </div>
      </section>

      {/* ── PROBLEM STATEMENT ── */}
      <section className="section section-bg-light">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}>
            <motion.div variants={fadeUp} style={{ textAlign:"center", maxWidth:"780px", margin:"0 auto 3.5rem" }}>
              <span style={{ display:"inline-block", background:"rgba(57,211,83,0.1)", color:"#2ab83f", border:"1px solid rgba(57,211,83,0.3)", borderRadius:"2rem", padding:"0.3rem 1rem", fontSize:"0.72rem", fontWeight:"700", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"1rem" }}>The Challenge</span>
              <h2>Setting Up an EV Station Is Not Just About Buying a Charger</h2>
              <p>Launching in Pakistan requires site assessment, load evaluation, regulatory approvals, utility coordination, safety compliance, and a commercially viable model.</p>
            </motion.div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"1.25rem" }}>
              {PROBLEMS.map((item,i) => (
                <motion.div key={i} variants={fadeUp} whileHover={{ y:-6, boxShadow:"0 24px 48px rgba(0,0,0,0.1)" }} transition={{ type:"spring", stiffness:300 }}
                  style={{ padding:"2rem", borderRadius:"16px", background:"white", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", border:"1px solid #EEF1F5", borderTop:`3px solid ${item.color || '#EF4444'}`, transition:"all 0.3s" }}>
                  <div style={{ width:"52px", height:"52px", borderRadius:"14px", background:`${item.color || '#EF4444'}15`, border:`1px solid ${item.color || '#EF4444'}30`, display:"flex", alignItems:"center", justifyContent:"center", color:item.color || '#EF4444', marginBottom:"1.25rem" }}>
                    {renderIcon(item.iconName, 26)}
                  </div>
                  <h3 style={{ fontSize:"1.05rem", marginBottom:"0.6rem", fontWeight: 700 }}>{item.title}</h3>
                  <p style={{ margin:0, lineHeight:1.65, fontSize:"0.9rem" }}>{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}>
            <motion.div variants={fadeUp} style={{ textAlign:"center", maxWidth:"760px", margin:"0 auto 3.5rem" }}>
              <span style={{ display:"inline-block", background:"rgba(0,174,239,0.1)", color:"#00AEEF", border:"1px solid rgba(0,174,239,0.3)", borderRadius:"2rem", padding:"0.3rem 1rem", fontSize:"0.72rem", fontWeight:"700", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"1rem" }}>Our Expertise</span>
              <h2>Complete EV Charging Advisory Services</h2>
              <p>We guide clients from concept to commissioning — technical, regulatory, commercial, and project development.</p>
            </motion.div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"1.1rem" }}>
              {SERVICES.map((s,i) => (
                <motion.div key={i} variants={fadeUp} whileHover={{ scale:1.03, borderColor:"#39D353", boxShadow:"0 8px 30px rgba(57,211,83,0.12)" }} transition={{ type:"spring", stiffness:400 }}
                  style={{ padding:"1.8rem", textAlign:"center", borderRadius:"14px", background:"var(--color-bg)", border:"1px solid #EEF1F5", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", transition:"all 0.3s" }}>
                  <LucideIcons.CheckCircle style={{ color:"#39D353", margin:"0 auto 1rem" }} size={30}/>
                  <h4 style={{ fontSize:"0.97rem", margin:0, fontWeight:"600", color:"#0B1F33" }}>{s}</h4>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHO WE HELP ── */}
      <section className="section section-bg-light">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}>
            <motion.div variants={fadeUp} style={{ textAlign:"center", marginBottom:"3.5rem" }}>
              <span style={{ display:"inline-block", background:"rgba(57,211,83,0.1)", color:"#2ab83f", border:"1px solid rgba(57,211,83,0.3)", borderRadius:"2rem", padding:"0.3rem 1rem", fontSize:"0.72rem", fontWeight:"700", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"1rem" }}>Who We Serve</span>
              <h2>Who Can Benefit from EV Charging Stations?</h2>
            </motion.div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"1.1rem" }}>
              {WHO.map((item,i) => (
                <motion.div key={i} variants={fadeUp} whileHover={{ y:-5, boxShadow:"0 16px 36px rgba(0,0,0,0.08)" }} transition={{ type:"spring", stiffness:300 }}
                  style={{ padding:"1.8rem", borderRadius:"14px", background:"white", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", border:"1px solid #EEF1F5" }}>
                  <div style={{ width:"48px", height:"48px", borderRadius:"12px", background:`${item.color || '#00AEEF'}15`, border:`1px solid ${item.color || '#00AEEF'}30`, display:"flex", alignItems:"center", justifyContent:"center", color:item.color || '#00AEEF', marginBottom:"1rem" }}>
                    {renderIcon(item.iconName, 22)}
                  </div>
                  <h4 style={{ marginBottom:"0.4rem", fontSize:"0.97rem", fontWeight: 700 }}>{item.title}</h4>
                  <p style={{ fontSize:"0.83rem", margin:0, color:"var(--color-text-light)" }}>{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="section section-bg-dark" style={{ position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"url(/clean_energy_city.png)", backgroundSize:"cover", backgroundPosition:"center", opacity:0.1 }} />
        <motion.div animate={{ scale:[1,1.1,1], opacity:[0.15,0.3,0.15] }} transition={{ duration:6, repeat:Infinity }}
          style={{ position:"absolute", top:"-10%", right:"-5%", width:"500px", height:"500px", borderRadius:"50%", background:"radial-gradient(circle,rgba(57,211,83,0.2) 0%,transparent 70%)" }} />
        <div className="container" style={{ position:"relative", zIndex:1 }}>
          <div className="why-grid" style={{ display:"grid", gridTemplateColumns:"1fr", gap:"3rem", alignItems:"center" }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger} className="why-text">
              <motion.span variants={fadeUp} style={{ display:"inline-block", background:"rgba(57,211,83,0.15)", color:"#39D353", border:"1px solid rgba(57,211,83,0.3)", borderRadius:"2rem", padding:"0.3rem 1rem", fontSize:"0.72rem", fontWeight:"700", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"1.2,rem" }}>{WHY.tag}</motion.span>
              <motion.h2 variants={fadeUp} style={{ color:"white", marginBottom:"1rem" }}>{WHY.title}</motion.h2>
              <motion.p variants={fadeUp} style={{ fontSize:"1.05rem", marginBottom:"2rem", color:"rgba(255,255,255,0.7)" }}>{WHY.subtitle}</motion.p>
              <ul style={{ display:"flex", flexDirection:"column", gap:"0.9rem", padding:0, listStyle:"none" }}>
                {(WHY.items || []).map((pt,i) => (
                  <motion.li key={i} variants={fadeUp} style={{ display:"flex", alignItems:"center", gap:"0.9rem" }}>
                    <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"rgba(57,211,83,0.15)", border:"1px solid rgba(57,211,83,0.4)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <LucideIcons.CheckCircle style={{ color:"#39D353" }} size={14}/>
                    </div>
                    <span style={{ color:"rgba(255,255,255,0.85)", fontWeight:"500", fontSize:"0.95rem" }}>{pt}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <div className="why-img" style={{ borderRadius:"20px", overflow:"hidden", boxShadow:"0 30px 70px rgba(0,0,0,0.5)", border:"1px solid rgba(255,255,255,0.07)" }}>
              <img src="/ev_charging_business.png" alt="EV Charging Business Pakistan" style={{ width:"100%", height:"clamp(220px,40vw,460px)", objectFit:"cover", display:"block" }}/>
            </div>
          </div>
        </div>
        <style>{`@media(min-width:768px){.why-grid{grid-template-columns:1fr 1fr !important;gap:4rem !important;}}`}</style>
      </section>

      {/* ── CTA ── */}
      <section className="section" style={{ textAlign:"center" }}>
        <div className="container">
          <div style={{ background:"linear-gradient(135deg,#040D1A 0%,#0B1F33 50%,#0a2240 100%)", borderRadius:"24px", padding:"5rem 2rem", color:"white", position:"relative", overflow:"hidden", boxShadow:"0 30px 70px rgba(0,0,0,0.25)" }}>
            <div style={{ position:"absolute", top:"-80px", left:"-80px", width:"320px", height:"320px", borderRadius:"50%", background:"radial-gradient(circle,rgba(0,174,239,0.2) 0%,transparent 70%)" }} />
            <div style={{ position:"absolute", bottom:"-80px", right:"-80px", width:"320px", height:"320px", borderRadius:"50%", background:"radial-gradient(circle,rgba(57,211,83,0.2) 0%,transparent 70%)" }} />
            <div style={{ position:"relative", zIndex:1 }}>
              <span style={{ display:"inline-block", background:"rgba(57,211,83,0.15)", color:"#39D353", border:"1px solid rgba(57,211,83,0.3)", borderRadius:"2rem", padding:"0.3rem 1rem", fontSize:"0.72rem", fontWeight:"700", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"1.5rem" }}>{CTA.tag}</span>
              <h2 style={{ color:"white", marginBottom:"1rem", fontSize:"clamp(1.6rem,4vw,2.8rem)", fontWeight:"900" }}>{CTA.title}</h2>
              <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"1.15rem", marginBottom:"2.5rem", maxWidth:"560px", margin:"0 auto 2.5rem", lineHeight:1.7 }}>{CTA.description}</p>
              <Link href="/contact" style={{ display:"inline-flex", alignItems:"center", gap:"0.6rem", padding:"1.1rem 2.6rem", background:"linear-gradient(135deg,#39D353,#2ab83f)", color:"#040D1A", fontWeight:"800", borderRadius:"50px", fontSize:"1.05rem", textDecoration:"none", boxShadow:"0 0 40px rgba(57,211,83,0.4)" }}>
                Book Free Consultation <LucideIcons.ArrowRight size={17}/>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
