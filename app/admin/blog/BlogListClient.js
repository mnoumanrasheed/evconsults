'use client';
import { useState } from 'react';
import Link from 'next/link';
import { deleteBlogPost } from '@/lib/actions/blog';
import DeleteModal from '@/components/admin/DeleteModal';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  BookOpen, 
  AlertCircle 
} from 'lucide-react';

export default function BlogListClient({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts || []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                          post.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    setError(null);

    try {
      const res = await deleteBlogPost(deleteId);
      if (res.error) {
        setError(res.error);
      } else {
        setPosts(prev => prev.filter(p => p.id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete post.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Controls Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, maxWidth: '500px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94A3B8'
            }} />
            <input
              type="text"
              placeholder="Search posts by title or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 1rem 0.6rem 2.5rem',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.6rem 1rem',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '0.9rem',
              backgroundColor: '#ffffff',
              outline: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>

        {/* Add Post Button */}
        <Link href="/admin/blog/new" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 1.25rem',
          borderRadius: '8px',
          backgroundColor: '#00AEEF',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '0.9rem',
          transition: 'background-color 0.2s'
        }}>
          <Plus size={16} /> Write Post
        </Link>
      </div>

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          color: '#EF4444',
          fontSize: '0.85rem'
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Posts Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #EEF1F5',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }}>
        {filteredPosts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: '#555555'
          }}>
            <BookOpen size={40} style={{ color: '#E2E8F0', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0B1F33', margin: '0 0 0.25rem 0' }}>No posts found</h3>
            <p style={{ fontSize: '0.85rem', color: '#555555', margin: 0 }}>Try clearing your filters or create a new blog post.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9rem',
              textAlign: 'left'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #EEF1F5' }}>
                  <th style={{ padding: '1rem 1.5rem', color: '#555555', fontWeight: 600 }}>Title</th>
                  <th style={{ padding: '1rem 1.5rem', color: '#555555', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '1rem 1.5rem', color: '#555555', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', color: '#555555', fontWeight: 600 }}>Created Date</th>
                  <th style={{ padding: '1rem 1.5rem', color: '#555555', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id} style={{
                    borderBottom: '1px solid #EEF1F5',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#0B1F33', maxWidth: '350px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span>{post.title}</span>
                        <code style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 400 }}>/blog/{post.slug}</code>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#555555' }}>
                      <span style={{
                        padding: '0.15rem 0.5rem',
                        backgroundColor: 'rgba(139, 92, 246, 0.08)',
                        color: '#8B5CF6',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 600
                      }}>
                        {post.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{
                        padding: '0.15rem 0.5rem',
                        borderRadius: '50px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: post.status === 'PUBLISHED' ? 'rgba(57, 211, 83, 0.12)' : 'rgba(148, 163, 184, 0.12)',
                        color: post.status === 'PUBLISHED' ? '#39D353' : '#64748B',
                      }}>
                        {post.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#94A3B8', fontSize: '0.82rem' }}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'end', gap: '0.5rem' }}>
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            border: '1px solid #E2E8F0',
                            color: '#555555',
                            backgroundColor: '#ffffff'
                          }}
                          title="Preview"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            backgroundColor: '#00AEEF',
                            color: '#ffffff'
                          }}
                          title="Edit"
                        >
                          <Edit size={15} />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(post.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            backgroundColor: '#EF4444',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? It will be permanently removed from the website and cannot be recovered."
      />
    </div>
  );
}
