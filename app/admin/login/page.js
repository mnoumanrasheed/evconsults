'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap, Loader, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid email or password.');
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '400px',
      padding: '2.5rem',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      border: '1px solid #EEF1F5',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      margin: '2rem'
    }}>
      {/* Brand & Logo */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          backgroundColor: 'rgba(57, 211, 83, 0.1)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#39D353',
          marginBottom: '1rem',
          border: '1px solid rgba(57, 211, 83, 0.2)'
        }}>
          <Zap size={26} fill="#39D353" />
        </div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: '#0B1F33',
          margin: '0 0 0.25rem 0'
        }}>
          EVConsults Admin
        </h2>
        <p style={{
          fontSize: '0.85rem',
          color: '#555555',
          margin: 0
        }}>
          Sign in to manage your website content.
        </p>
      </div>

      {/* Error Alert */}
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
          fontSize: '0.85rem',
          fontWeight: 500
        }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#0B1F33'
          }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@evconsults.pk"
            disabled={isLoading}
            style={{
              padding: '0.75rem 1rem',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '0.95rem',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
              width: '100%',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#00AEEF'}
            onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#0B1F33'
          }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            disabled={isLoading}
            style={{
              padding: '0.75rem 1rem',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '0.95rem',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
              width: '100%',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#00AEEF'}
            onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '0.85rem',
            backgroundColor: '#00AEEF',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '0.5rem',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => { if (!isLoading) e.target.style.backgroundColor = '#0099d1'; }}
          onMouseLeave={(e) => { if (!isLoading) e.target.style.backgroundColor = '#00AEEF'; }}
        >
          {isLoading ? (
            <>
              <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
