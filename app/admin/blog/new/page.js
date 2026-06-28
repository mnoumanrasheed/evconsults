'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBlogPost, generateSlug } from '@/lib/actions/blog';
import RichTextEditor from '@/components/admin/RichTextEditor';
import AdminHeader from '@/components/admin/AdminHeader';
import { 
  ArrowLeft, 
  Save, 
  Loader, 
  AlertCircle,
  Eye,
  Settings,
  Image as ImageIcon
} from 'lucide-react';

export default function NewBlogPost() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    category: 'Business Guide',
    image: '',
    imageAlt: '',
    readTime: '5 min read',
    accent: '#00AEEF',
    status: 'DRAFT',
    seoTitle: '',
    seoDesc: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Auto-generate slug from title
  useEffect(() => {
    if (!formData.title) return;
    const timer = setTimeout(async () => {
      // Only auto-generate if slug is empty or matches previous slug format
      const slugged = await generateSlug(formData.title);
      setFormData(prev => ({ ...prev, slug: slugged }));
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.title]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBodyChange = (value) => {
    setFormData(prev => ({ ...prev, body: value || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate body content
    if (!formData.body || formData.body.trim().length < 10) {
      setError('Body content must be at least 10 characters.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await createBlogPost(formData);
      if (res.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        router.push('/admin/blog');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to create blog post.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="Write New Blog Post" />

      {/* Action Header */}
      <div style={{
        padding: '1rem 2rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #EEF1F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button
          onClick={() => router.push('/admin/blog')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            border: 'none',
            background: 'none',
            color: '#555555',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} /> Back to posts
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              backgroundColor: '#00AEEF',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {isLoading ? (
              <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Save size={16} />
            )}
            <span>Publish / Save</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <main style={{ padding: '2rem', backgroundColor: '#F5F7FA', flex: 1 }}>
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            padding: '0.75rem 1.25rem',
            color: '#EF4444',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={18} />
            <span>Error: {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem'
        }} className="editor-grid">
          
          {/* Main Content Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #EEF1F5',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              {/* Title */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={labelStyle}>Post Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. How to Get a NEPRA EV Charging License"
                  style={inputStyle}
                />
              </div>

              {/* Slug */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={labelStyle}>URL Slug</label>
                <div style={{ display: 'flex', alignItems: 'stretch' }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    borderRight: 'none',
                    padding: '0 0.75rem',
                    color: '#64748B',
                    fontSize: '0.85rem',
                    borderTopLeftRadius: '8px',
                    borderBottomLeftRadius: '8px'
                  }}>
                    /blog/
                  </span>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    style={{
                      ...inputStyle,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0
                    }}
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={labelStyle}>Short Summary (Excerpt)</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Provide a concise 1-2 sentence description for listing grids..."
                  style={textareaStyle}
                />
              </div>

              {/* Body */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={labelStyle}>Post Body Content (Markdown Supported)</label>
                <RichTextEditor value={formData.body} onChange={handleBodyChange} />
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Publishing Settings */}
            <div style={sidebarCardStyle}>
              <h3 style={sidebarTitleStyle}>Publish Settings</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={labelStyle}>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={labelStyle}>Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Business Guide"
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={labelStyle}>Read Time</label>
                  <input
                    type="text"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleChange}
                    placeholder="e.g. 5 min read"
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={labelStyle}>Branding Accent Color</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="color"
                      name="accent"
                      value={formData.accent}
                      onChange={handleChange}
                      style={{
                        padding: 0,
                        border: 'none',
                        width: '40px',
                        height: '40px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: 'transparent'
                      }}
                    />
                    <input
                      type="text"
                      name="accent"
                      value={formData.accent}
                      onChange={handleChange}
                      placeholder="#00AEEF"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div style={sidebarCardStyle}>
              <h3 style={sidebarTitleStyle}>Featured Image</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={labelStyle}>Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://res.cloudinary.com/..."
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={labelStyle}>Alt Text</label>
                  <input
                    type="text"
                    name="imageAlt"
                    value={formData.imageAlt}
                    onChange={handleChange}
                    placeholder="Describe image for SEO..."
                    style={inputStyle}
                  />
                </div>
                {formData.image && (
                  <div style={{
                    width: '100%',
                    height: '140px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <img
                      src={formData.image}
                      alt={formData.imageAlt || 'Preview'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SEO Settings */}
            <div style={sidebarCardStyle}>
              <h3 style={sidebarTitleStyle}>SEO Metadata (Optional)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={labelStyle}>Meta Title</label>
                  <input
                    type="text"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleChange}
                    placeholder="Custom meta title tag..."
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={labelStyle}>Meta Description</label>
                  <textarea
                    name="seoDesc"
                    value={formData.seoDesc}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Custom meta search summary..."
                    style={textareaStyle}
                  />
                </div>
              </div>
            </div>

          </div>
        </form>
      </main>

      <style>{`
        @media (min-width: 1024px) {
          .editor-grid {
            grid-template-columns: 1fr 340px !important;
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

// Styling Constants
const inputStyle = {
  padding: '0.75rem 1rem',
  border: '1px solid #E2E8F0',
  borderRadius: '8px',
  fontSize: '0.92rem',
  outline: 'none',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box'
};

const textareaStyle = {
  padding: '0.75rem 1rem',
  border: '1px solid #E2E8F0',
  borderRadius: '8px',
  fontSize: '0.92rem',
  outline: 'none',
  fontFamily: 'inherit',
  width: '100%',
  resize: 'vertical',
  boxSizing: 'border-box'
};

const labelStyle = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#0B1F33'
};

const sidebarCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #EEF1F5',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const sidebarTitleStyle = {
  fontSize: '0.95rem',
  fontWeight: 700,
  color: '#0B1F33',
  margin: 0,
  borderBottom: '1px solid #F1F5F9',
  paddingBottom: '0.5rem'
};
