'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  Image as ImageIcon, 
  Inbox, 
  Settings, 
  LogOut, 
  Globe 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Pages', path: '/admin/pages', icon: <FileText size={20} /> },
    { name: 'Blog', path: '/admin/blog', icon: <BookOpen size={20} /> },
    { name: 'Media Library', path: '/admin/media', icon: <ImageIcon size={20} /> },
    { name: 'Contact Requests', path: '/admin/contact-requests', icon: <Inbox size={20} /> },
    { name: 'Global Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#0B1F33',
      color: '#ffffff',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      zIndex: 1000
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          backgroundColor: '#39D353',
          padding: '0.35rem',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Globe size={20} color="#0B1F33" />
        </div>
        <span style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          letterSpacing: '0.5px'
        }}>
          Admin Portal
        </span>
      </div>

      {/* Nav List */}
      <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {links.map((link) => {
          const isActive = pathname === link.path || (link.path !== '/admin/dashboard' && pathname.startsWith(link.path));
          return (
            <Link
              key={link.path}
              href={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                backgroundColor: isActive ? '#00AEEF' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s ease',
              }}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer / Logout */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Link
          href="/"
          target="_blank"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '0.5rem',
            fontWeight: 500,
            fontSize: '0.9rem'
          }}
        >
          <Globe size={18} />
          <span>View Public Site</span>
        </Link>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            color: '#EF4444',
            background: 'none',
            border: 'none',
            width: '100%',
            cursor: 'pointer',
            textAlign: 'left',
            fontWeight: 500,
            fontSize: '0.9rem',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
