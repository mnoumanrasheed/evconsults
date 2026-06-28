import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, Twitter, Linkedin, Facebook } from 'lucide-react';
import { marked } from 'marked';

export const revalidate = 0; // Dynamic rendering

// Dynamic SEO metadata generation
export async function generateMetadata({ params }) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug }
    });
    if (!post) return { title: 'Post Not Found | EVConsults' };
    return {
      title: `${post.seoTitle || post.title} | EVConsults Insights`,
      description: post.seoDesc || post.excerpt || '',
    };
  } catch (err) {
    return { title: 'EV Insights | EVConsults' };
  }
}

export default async function BlogPost({ params }) {
  let post = null;
  try {
    post = await prisma.blogPost.findUnique({
      where: { slug: params.slug }
    });
  } catch (err) {
    console.warn('[BlogPost] database fetch failed.');
  }

  if (!post || post.status !== 'PUBLISHED') {
    notFound();
  }

  // Parse markdown content to HTML
  const htmlContent = marked.parse(post.body || '');
  
  const dateFormatted = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const accentColor = post.accent || '#00AEEF';
  const headerBg = `linear-gradient(135deg, ${accentColor}E6, #0B1F33F2)`;

  return (
    <article style={{ paddingBottom: '4rem' }}>
      {/* Blog Header */}
      <section style={{ 
        position: 'relative', 
        padding: 'clamp(5rem,14vw,8rem) 0 clamp(3rem,6vw,6rem)',
        minHeight: '45vh',
        display: 'flex',
        alignItems: 'center',
        background: `${headerBg}, url(${post.image || '/clean_energy_city.png'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> Back to all articles
          </Link>
          <div style={{ maxWidth: '860px', animation: 'fadeInUp 0.6s ease' }}>
            <div style={{ display: 'inline-block', backgroundColor: 'var(--color-secondary)', color: 'var(--color-primary)', padding: '0.25rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '1.25rem', letterSpacing: '1px' }}>
              {post.category}
            </div>
            <h1 style={{ color: 'white', fontSize: 'clamp(1.6rem,4vw,3rem)', marginBottom: '1.5rem', lineHeight: 1.2 }}>{post.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'rgba(255,255,255,0.8)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} /> {dateFormatted}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag size={16} /> {post.readTime || '5 min read'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section style={{ marginTop: '-3rem', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div className="blog-layout">
            
            {/* Social Share Sidebar */}
            <div className="blog-share-sidebar">
              <div style={{ position: 'sticky', top: '120px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', fontWeight: '600', textTransform: 'uppercase' }}>Share</span>
                <button style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', cursor: 'pointer', color: '#1da1f2' }}><Twitter size={16} /></button>
                <button style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', cursor: 'pointer', color: '#0a66c2' }}><Linkedin size={16} /></button>
                <button style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', cursor: 'pointer', color: '#1877f2' }}><Facebook size={16} /></button>
              </div>
            </div>

            {/* Main Article */}
            <div>
              <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', padding: 'clamp(1.5rem,5vw,3rem)', boxShadow: 'var(--shadow-lg)', border: '1px solid #EEF1F5' }}>
                <div 
                  className="blog-content"
                  style={{ lineHeight: 1.8, fontSize: 'clamp(0.95rem,2vw,1.1rem)', color: '#334155' }}
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
                
                <hr style={{ margin: '3rem 0 2rem', borderColor: '#E2E8F0' }} />
                
                <div style={{ backgroundColor: 'rgba(0, 174, 239, 0.05)', padding: 'clamp(1.25rem,4vw,2rem)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)', fontWeight: 700 }}>Need Professional Guidance?</h3>
                  <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-light)' }}>Our experts are ready to assist you with EV charging station feasibility, licensing, and implementation.</p>
                  <Link href="/contact" className="btn btn-primary">Book a Free Consultation</Link>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .blog-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        .blog-share-sidebar {
          display: none;
        }
        @media (min-width: 992px) {
          .blog-layout {
            grid-template-columns: 60px 1fr;
            gap: 3rem;
          }
          .blog-share-sidebar {
            display: block;
          }
        }
        .blog-content h2 {
          color: var(--color-primary);
          font-size: clamp(1.25rem, 3vw, 1.8rem);
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        .blog-content p {
          margin-bottom: 1.5rem;
        }
        .blog-content ul {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
          list-style: disc;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
          color: #555;
        }
        .blog-content blockquote {
          border-left: 4px solid var(--color-secondary);
          padding: 1.25rem 1.5rem;
          font-size: clamp(1rem, 2vw, 1.2rem);
          font-style: italic;
          color: var(--color-primary);
          margin: 2rem 0;
          background: rgba(57, 211, 83, 0.05);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
        }
      `}</style>
    </article>
  );
}
