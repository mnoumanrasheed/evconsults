'use client';
import { User } from 'lucide-react';

export default function AdminHeader({ title, userEmail }) {
  return (
    <header style={{
      height: '70px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #EEF1F5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 900
    }}>
      <div style={{ flex: 1 }}>
        <h1 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          margin: 0,
          color: '#0B1F33'
        }}>
          {title || 'Dashboard'}
        </h1>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        backgroundColor: '#F5F7FA',
        padding: '0.5rem 1rem',
        borderRadius: '50px',
        border: '1px solid #E2E8F0'
      }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: '#00AEEF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff'
        }}>
          <User size={14} />
        </div>
        <span style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#0B1F33'
        }}>
          {userEmail || 'Admin'}
        </span>
      </div>
    </header>
  );
}
