'use client';
import { useState, useRef } from 'react';
import { Upload, Loader, Image as ImageIcon } from 'lucide-react';
import { getUploadSignature, createMediaRecord } from '@/lib/actions/media';

export default function MediaUploader({ onUploadComplete }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);
    setProgress(10);

    try {
      // 1. Get Signature from Server Action
      const sigData = await getUploadSignature();
      if (sigData.error) {
        throw new Error(sigData.error);
      }

      setProgress(30);

      // 2. Prepare FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', sigData.apiKey);
      formData.append('timestamp', sigData.timestamp.toString());
      formData.append('signature', sigData.signature);
      formData.append('folder', sigData.folder);

      setProgress(50);

      // 3. Upload directly to Cloudinary
      const res = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || 'Failed to upload to Cloudinary');
      }

      const cloudData = await res.json();
      setProgress(80);

      // 4. Save to Database using Server Action
      const dbRes = await createMediaRecord({
        url: cloudData.secure_url,
        publicId: cloudData.public_id,
        alt: file.name.split('.')[0],
        mimeType: cloudData.format,
        width: cloudData.width,
        height: cloudData.height,
        bytes: cloudData.bytes
      });

      if (dbRes.error) {
        throw new Error(dbRes.error);
      }

      setProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
        if (onUploadComplete) onUploadComplete(dbRes.media);
      }, 500);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Something went wrong during upload.');
      setIsUploading(false);
      setProgress(0);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{
      border: '2px dashed #E2E8F0',
      borderRadius: '12px',
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#F8FAFC',
      cursor: isUploading ? 'not-allowed' : 'pointer',
      transition: 'border-color 0.2s',
      position: 'relative'
    }}
    onMouseEnter={(e) => { if (!isUploading) e.currentTarget.style.borderColor = '#00AEEF'; }}
    onMouseLeave={(e) => { if (!isUploading) e.currentTarget.style.borderColor = '#E2E8F0'; }}
    onClick={isUploading ? null : triggerFileInput}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*"
        disabled={isUploading}
      />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        {isUploading ? (
          <>
            <Loader size={36} style={{ color: '#00AEEF', animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0B1F33' }}>
              Uploading image... {progress}%
            </span>
            <div style={{
              width: '100%',
              maxWidth: '200px',
              height: '4px',
              backgroundColor: '#E2E8F0',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: '#00AEEF',
                transition: 'width 0.2s ease-out'
              }} />
            </div>
          </>
        ) : (
          <>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 174, 239, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00AEEF'
            }}>
              <Upload size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0B1F33', display: 'block' }}>
                Click to upload an image
              </span>
              <span style={{ fontSize: '0.8rem', color: '#555555', display: 'block', marginTop: '0.25rem' }}>
                PNG, JPG, WEBP or GIF up to 5MB
              </span>
            </div>
          </>
        )}
      </div>

      {error && (
        <div style={{
          marginTop: '1rem',
          color: '#EF4444',
          fontSize: '0.85rem',
          fontWeight: 500
        }}>
          {error}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
