'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: "easeOut" },
  }),
};

export default function BlogListClient({ initialPosts }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(initialPosts.map((p) => p.category)))];

  const filtered =
    activeCategory === "All"
      ? initialPosts
      : initialPosts.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Category Filter Sticky Nav */}
      <div style={{
        background:'#fff',
        borderBottom:'1px solid #EEF1F5',
        position:'sticky',
        top:'72px',
        zIndex: 50,
      }}>
        <div className="container">
          <div style={{
            display:'flex',
            gap:'0.5rem',
            padding:'1rem 0',
            overflowX:'auto',
            scrollbarWidth:'none',
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink:0,
                  padding:'0.45rem 1.1rem',
                  borderRadius:'2rem',
                  border:`1.5px solid ${activeCategory === cat ? 'var(--color-accent)' : '#E2E8F0'}`,
                  background: activeCategory === cat ? 'var(--color-accent)' : 'transparent',
                  color: activeCategory === cat ? '#fff' : 'var(--color-text-light)',
                  fontSize:'0.82rem',
                  fontWeight:'600',
                  cursor:'pointer',
                  transition:'all 0.22s ease',
                  letterSpacing:'0.3px',
                  whiteSpace:'nowrap',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Post Grid */}
      <section style={{ padding:'4rem 0 6rem', background:'#F8FAFC' }}>
        <div className="container">
          {/* post count */}
          <motion.p
            key={activeCategory}
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            style={{ fontSize:'0.88rem', color:'var(--color-text-light)', marginBottom:'2rem' }}
          >
            Showing <strong style={{ color:'var(--color-primary)' }}>{filtered.length}</strong>{' '}
            article{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
          </motion.p>

          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill, minmax(330px, 1fr))',
            gap:'1.75rem',
          }}>
            {filtered.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function BlogCard({ post, index }) {
  const accentColor = post.accent || '#00AEEF';

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once:true, margin:'-40px' }}
      custom={index % 3}
      variants={fadeUp}
      style={{
        background:'#fff',
        borderRadius:'14px',
        border:'1px solid #EEF1F5',
        overflow:'hidden',
        display:'flex',
        flexDirection:'column',
        boxShadow:'0 2px 8px rgba(0,0,0,0.04)',
        transition:'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      whileHover={{
        y: -6,
        boxShadow: '0 16px 40px rgba(0,0,0,0.1)',
      }}
      onMouseEnter={(e) => { 
        e.currentTarget.style.borderColor = accentColor; 
        const img = e.currentTarget.querySelector('.card-img'); 
        if(img) img.style.transform = 'scale(1.07)'; 
      }}
      onMouseLeave={(e) => { 
        e.currentTarget.style.borderColor = '#EEF1F5'; 
        const img = e.currentTarget.querySelector('.card-img'); 
        if(img) img.style.transform = 'scale(1)'; 
      }}
    >
      {/* Image */}
      <div style={{ height: '190px', overflow: 'hidden' }}>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${post.image || '/clean_energy_city.png'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'transform 0.5s ease',
        }} className="card-img" />
      </div>

      <div style={{ padding:'1.75rem', display:'flex', flexDirection:'column', flex:1 }}>
        {/* Category badge */}
        <span style={{
          display:'inline-block',
          padding:'0.3rem 0.85rem',
          background:`${accentColor}18`,
          color: accentColor,
          borderRadius:'2rem',
          fontSize:'0.72rem',
          fontWeight:'700',
          letterSpacing:'1px',
          textTransform:'uppercase',
          marginBottom:'0.85rem',
          alignSelf:'flex-start',
        }}>
          {post.category}
        </span>

        {/* Title */}
        <h3 style={{
          fontSize:'1.1rem',
          fontWeight:'700',
          lineHeight:1.45,
          color:'var(--color-primary)',
          margin: '0 0 0.75rem 0',
        }}>
          <Link
            href={`/blog/${post.slug}`}
            style={{ color:'inherit', transition:'color 0.2s', textDecoration:'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = accentColor; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-primary)'; }}
          >
            {post.title}
          </Link>
        </h3>

        {/* Excerpt — short summary only, never full body */}
        {post.excerpt ? (
          <p style={{
            fontSize:'0.9rem',
            color:'var(--color-text-light)',
            lineHeight:1.65,
            margin: '0 0 1.25rem 0',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {post.excerpt}
          </p>
        ) : null}

        {/* Footer meta — pinned to card bottom */}
        <div style={{
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between',
          paddingTop:'1rem',
          borderTop:'1px solid #EEF1F5',
          marginTop:'auto',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
            <span style={{ display:'flex', alignItems:'center', gap:'0.35rem', fontSize:'0.8rem', color:'#94a3b8' }}>
              <Calendar size={13} /> {post.date}
            </span>
            <span style={{ display:'flex', alignItems:'center', gap:'0.35rem', fontSize:'0.8rem', color:'#94a3b8' }}>
              <Clock size={13} /> {post.readTime || '5 min read'}
            </span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            style={{
              display:'inline-flex',
              alignItems:'center',
              gap:'0.3rem',
              fontSize:'0.82rem',
              fontWeight:'700',
              color: accentColor,
              letterSpacing:'0.3px',
              transition:'gap 0.2s ease',
              textDecoration:'none'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.gap = '0.6rem'; }}
            onMouseLeave={(e) => { e.currentTarget.style.gap = '0.3rem'; }}
          >
            Read Article <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
