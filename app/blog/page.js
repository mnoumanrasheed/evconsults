import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowRight, Tag } from 'lucide-react';
import BlogListClient from './BlogListClient';

export const revalidate = 0; // Dynamic server rendering

// Page SEO Metadata
export async function generateMetadata() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'blog' }
    });
    return {
      title: page?.seoTitle || 'EV Insights & Industry Intelligence | EVConsults',
      description: page?.seoDesc || 'Expert analysis, regulatory updates, and practical guides for Pakistan\'s fast-growing electric vehicle charging sector.',
    };
  } catch (err) {
    return {
      title: 'EV Insights & Industry Intelligence | EVConsults',
      description: 'Expert analysis, regulatory updates, and practical guides for Pakistan\'s fast-growing electric vehicle charging sector.',
    };
  }
}

export default async function Blog() {
  let posts = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' }
    });
  } catch (err) {
    console.warn('[Blog] database fetch failed, showing empty posts list.');
  }

  // Map createdAt to a formatted date string for presentation
  const formattedPosts = posts.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.category,
    excerpt: post.excerpt,
    readTime: post.readTime,
    accent: post.accent,
    image: post.image,
    date: new Date(post.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }));

  return (
    <>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '9rem 0 6rem',
        background: 'linear-gradient(rgba(4, 13, 26, 0.85), rgba(11, 31, 51, 0.95)), url(/ev_charging_business.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position:'absolute', top:'-80px', left:'-80px', width:'420px', height:'420px', background:'radial-gradient(circle, rgba(0,174,239,0.12) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-60px', right:'-60px', width:'360px', height:'360px', background:'radial-gradient(circle, rgba(57,211,83,0.1) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />

        <div className="container" style={{ position:'relative', zIndex:2, textAlign:'center' }}>
          <div style={{ animation: 'fadeInUp 0.6s ease' }}>
            <span style={{
              display:'inline-flex', alignItems:'center', gap:'0.4rem',
              padding:'0.4rem 1.1rem',
              background:'rgba(57,211,83,0.12)',
              border:'1px solid rgba(57,211,83,0.3)',
              color:'#39D353',
              borderRadius:'2rem',
              fontSize:'0.78rem',
              fontWeight:'700',
              letterSpacing:'2px',
              textTransform:'uppercase',
              marginBottom:'1.5rem',
            }}>
              <Tag size={12} /> Knowledge Hub
            </span>

            <h1 style={{
              color:'#fff',
              fontSize:'clamp(2.2rem, 5vw, 3.6rem)',
              fontWeight:'800',
              letterSpacing:'-0.5px',
              lineHeight:1.15,
              marginBottom:'1.25rem',
            }}>
              EV Insights &amp; Industry Intelligence
            </h1>

            <p style={{
              color:'rgba(255,255,255,0.65)',
              fontSize:'1.15rem',
              maxWidth:'620px',
              margin:'0 auto',
              lineHeight:1.7,
            }}>
              Expert analysis, regulatory updates, and practical guides for Pakistan&apos;s fast-growing electric vehicle charging sector.
            </p>
          </div>
        </div>
      </section>

      {/* Blog list Client Wrapper */}
      <BlogListClient initialPosts={formattedPosts} />

      {/* CTA Banner */}
      <section style={{
        background:'linear-gradient(135deg, #0B1F33 0%, #0d2e50 100%)',
        padding:'4rem 0',
        textAlign:'center',
      }}>
        <div className="container">
          <div>
            <h2 style={{ color:'#fff', marginBottom:'0.75rem' }}>Have a Project in Mind?</h2>
            <p style={{ color:'rgba(255,255,255,0.65)', maxWidth:'520px', margin:'0 auto 2rem' }}>
              Our consultants are ready to guide you through feasibility, licensing, and implementation.
            </p>
            <Link href="/contact" className="btn btn-primary" style={{ padding:'0.85rem 2.2rem', fontSize:'1rem' }}>
              Book a Free Consultation <ArrowRight size={16} style={{ marginLeft:'0.5rem' }} />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
