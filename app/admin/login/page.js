'use client';
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap, Loader, AlertCircle, Eye, EyeOff, ShieldCheck, Lock } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';

  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState(null);
  const [blocked, setBlocked]       = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [resetIn, setResetIn]       = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  // Check rate-limit status on mount
  useEffect(() => {
    fetch('/api/admin/login-attempts')
      .then((r) => r.json())
      .then((data) => {
        setBlocked(data.blocked);
        setAttemptsLeft(data.attemptsLeft ?? 5);
        if (data.resetIn) setResetIn(data.resetIn);
      })
      .catch(() => {});
  }, []);

  // Countdown timer when blocked
  useEffect(() => {
    if (!blocked || !resetIn) return;
    if (resetIn <= 0) { setBlocked(false); setResetIn(null); return; }
    const t = setTimeout(() => setResetIn((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearTimeout(t);
  }, [blocked, resetIn]);

  const recordFailedAttempt = async () => {
    const res  = await fetch('/api/admin/login-attempts', { method: 'POST' });
    const data = await res.json();
    setBlocked(data.blocked);
    setAttemptsLeft(data.attemptsLeft ?? 0);
    if (data.resetIn) setResetIn(data.resetIn);
    return data.blocked;
  };

  const clearAttempts = () =>
    fetch('/api/admin/login-attempts', { method: 'DELETE' }).catch(() => {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (blocked) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn('credentials', { email, password, redirect: false });

      if (res?.error) {
        const nowBlocked = await recordFailedAttempt();
        if (nowBlocked) {
          setError('Too many failed attempts. Please wait 15 minutes before trying again.');
        } else {
          setError(
            `Invalid email or password.${attemptsLeft > 1 ? ` ${attemptsLeft - 1} attempt${attemptsLeft - 1 === 1 ? '' : 's'} remaining.` : ' This is your last attempt.'}`
          );
        }
        setIsLoading(false);
      } else {
        await clearAttempts();
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  const inputStyle = (field) => ({
    padding: '0.8rem 1rem',
    paddingRight: field === 'password' ? '3rem' : '1rem',
    border: `1.5px solid ${focusedField === field ? '#00AEEF' : 'rgba(255,255,255,0.12)'}`,
    borderRadius: '10px',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: '#ffffff',
    letterSpacing: field === 'password' ? '0.1em' : 'normal',
  });

  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
        input::placeholder { color: rgba(255,255,255,0.3) !important; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #0d2340 inset !important;
          -webkit-text-fill-color: #fff !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '2.5rem',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        animation: 'fadeIn 0.4s ease both',
        margin: '1.5rem',
      }}>

        {/* Brand */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px', height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(0,174,239,0.2), rgba(57,211,83,0.15))',
            border: '1px solid rgba(0,174,239,0.3)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 0 24px rgba(0,174,239,0.15)',
          }}>
            <Zap size={28} color="#00AEEF" fill="rgba(0,174,239,0.4)" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: '0 0 0.25rem' }}>
            EVConsults Admin
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            Authorised access only
          </p>
        </div>

        {/* Security badge */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '0.4rem', color: 'rgba(57,211,83,0.8)', fontSize: '0.75rem', fontWeight: 600,
        }}>
          <ShieldCheck size={14} />
          <span>Secured with end-to-end encryption</span>
        </div>

        {/* Error / Blocked message */}
        {(error || blocked) && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
            backgroundColor: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '10px',
            padding: '0.8rem 1rem',
            color: '#FCA5A5',
            fontSize: '0.83rem',
            fontWeight: 500,
            lineHeight: 1.5,
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              {blocked
                ? `Account temporarily locked. Try again in ${resetIn !== null ? formatTime(resetIn) : '15 minutes'}.`
                : error}
            </span>
          </div>
        )}

        {/* Attempts warning */}
        {!blocked && attemptsLeft < 5 && attemptsLeft > 0 && !error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: 'rgba(251,191,36,0.08)',
            border: '1px solid rgba(251,191,36,0.2)',
            borderRadius: '10px',
            padding: '0.7rem 1rem',
            color: '#FCD34D',
            fontSize: '0.82rem',
          }}>
            <Lock size={14} style={{ flexShrink: 0 }} />
            <span>{attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining before lockout.</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.02em' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              required
              autoComplete="email"
              placeholder="admin@evconsults.pk"
              disabled={isLoading || blocked}
              style={inputStyle('email')}
            />
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.02em' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                disabled={isLoading || blocked}
                style={inputStyle('password')}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                disabled={isLoading || blocked}
                style={{
                  position: 'absolute', right: '0.9rem', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.35)', padding: 0,
                  display: 'flex', alignItems: 'center',
                }}
              >
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || blocked}
            style={{
              marginTop: '0.4rem',
              padding: '0.9rem',
              background: blocked
                ? 'rgba(100,100,100,0.3)'
                : 'linear-gradient(135deg, #00AEEF, #0091c7)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: (isLoading || blocked) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              boxShadow: blocked ? 'none' : '0 4px 20px rgba(0,174,239,0.3)',
              opacity: (isLoading || blocked) ? 0.7 : 1,
            }}
            onMouseEnter={(e) => { if (!isLoading && !blocked) e.currentTarget.style.filter = 'brightness(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
          >
            {isLoading ? (
              <>
                <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Verifying…
              </>
            ) : blocked ? (
              <>
                <Lock size={18} />
                Locked — Wait {resetIn !== null ? formatTime(resetIn) : ''}
              </>
            ) : (
              'Sign In to Admin Panel'
            )}
          </button>
        </form>

        {/* Footer */}
        <p style={{
          textAlign: 'center', fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.2)', margin: 0,
        }}>
          Unauthorised access attempts are logged and reported.
        </p>
      </div>
    </>
  );
}
