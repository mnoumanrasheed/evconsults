'use client';
import { AlertTriangle, Loader } from 'lucide-react';

export default function DeleteModal({ isOpen, onClose, onConfirm, title, message, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(4, 13, 26, 0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        border: '1px solid #EEF1F5',
        overflow: 'hidden',
        animation: 'modalFadeIn 0.2s ease-out'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'start'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#EF4444',
            flexShrink: 0
          }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#0B1F33',
              margin: '0 0 0.5rem 0'
            }}>
              {title || 'Confirm Delete'}
            </h3>
            <p style={{
              fontSize: '0.9rem',
              color: '#555555',
              lineHeight: 1.5,
              margin: 0
            }}>
              {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{
          backgroundColor: '#F8FAFC',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'end',
          gap: '0.75rem',
          borderTop: '1px solid #EEF1F5'
        }}>
          <button
            onClick={onClose}
            disabled={isDeleting}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#ffffff',
              color: '#0B1F33',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#EF4444',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {isDeleting ? (
              <>
                <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
