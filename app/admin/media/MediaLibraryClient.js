'use client';
import { useState } from 'react';
import { listMedia, deleteMedia } from '@/lib/actions/media';
import MediaUploader from '@/components/admin/MediaUploader';
import DeleteModal from '@/components/admin/DeleteModal';
import { Copy, Trash2, Check, ExternalLink, ImageIcon, AlertCircle } from 'lucide-react';

export default function MediaLibraryClient({ initialMedia }) {
  const [media, setMedia] = useState(initialMedia || []);
  const [copiedId, setCopiedId] = useState(null);
  
  // Deletion modal
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleUploadComplete = (newMedia) => {
    setMedia(prev => [newMedia, ...prev]);
  };

  const handleCopyUrl = async (id, url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    setError(null);

    try {
      const res = await deleteMedia(deleteId);
      if (res.error) {
        setError(res.error);
      } else {
        setMedia(prev => prev.filter(m => m.id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete media record.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Upload Zone */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #EEF1F5',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B1F33', marginBottom: '1rem', marginTop: 0 }}>
          Upload New Media
        </h3>
        <MediaUploader onUploadComplete={handleUploadComplete} />
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

      {/* Media Grid */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #EEF1F5',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        minHeight: '300px'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B1F33', marginBottom: '1.5rem', marginTop: 0 }}>
          Media Assets ({media.length})
        </h3>

        {media.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: '#555555'
          }}>
            <ImageIcon size={48} style={{ color: '#E2E8F0', marginBottom: '1rem' }} />
            <p style={{ fontSize: '0.9rem', color: '#555555', margin: 0 }}>
              No images uploaded yet. Use the area above to add images to your media library.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1.5rem'
          }}>
            {media.map((item) => (
              <div key={item.id} style={{
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#F8FAFC',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                {/* Image Wrap */}
                <div style={{
                  width: '100%',
                  height: '140px',
                  position: 'relative',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: '1px solid #E2E8F0',
                  overflow: 'hidden'
                }}>
                  <img
                    src={item.url}
                    alt={item.alt || 'Asset'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Info & Actions */}
                <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#0B1F33',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }} title={item.alt}>
                    {item.alt || 'Untitled Asset'}
                  </div>
                  
                  <div style={{
                    fontSize: '0.68rem',
                    color: '#94A3B8',
                  }}>
                    {item.width && item.height ? `${item.width} x ${item.height}` : 'Image'} 
                    {item.bytes ? ` • ${(item.bytes / 1024).toFixed(0)} KB` : ''}
                  </div>

                  <div style={{
                    display: 'flex',
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: '0.5rem',
                    marginTop: '0.25rem',
                    gap: '0.5rem'
                  }}>
                    <button
                      onClick={() => handleCopyUrl(item.id, item.url)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem',
                        padding: '0.35rem',
                        borderRadius: '4px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: copiedId === item.id ? '#39D353' : '#ffffff',
                        color: copiedId === item.id ? '#0B1F33' : '#555555',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check size={12} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={12} /> Copy URL
                        </>
                      )}
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '4px',
                        border: '1px solid #E2E8F0',
                        color: '#555555',
                        backgroundColor: '#ffffff'
                      }}
                      title="Open in new tab"
                    >
                      <ExternalLink size={12} />
                    </a>
                    <button
                      onClick={() => handleDeleteClick(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '4px',
                        backgroundColor: '#EF4444',
                        color: '#ffffff',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      title="Delete asset"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Media File"
        message="Are you sure you want to delete this media asset? It will be permanently removed from Cloudinary and database, which might break any blog posts or page layouts referencing it."
      />
    </div>
  );
}
