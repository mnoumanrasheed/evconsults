import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Sidebar from '@/components/admin/Sidebar';

export const metadata = {
  title: 'EVConsults Admin Portal',
  description: 'Manage website content, blog posts, contact requests, and global settings.',
};

export default async function AdminLayout({ children }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '';
  const isLoginPage = pathname === '/admin/login' || pathname.startsWith('/admin/login');

  const session = await auth();

  // ── First line of defence: strict session check for non-login pages ──────
  if (!isLoginPage && (!session || !session.user)) {
    redirect('/admin/login');
  }

  // ── Second line of defence: strict role check for non-login pages ─────────
  if (!isLoginPage && session?.user?.role !== 'ADMIN') {
    redirect('/');
  }

  // ── Login page: ALWAYS render bare layout without sidebar ─────────────────
  if (isLoginPage) {
    // If they try to access login while already logged in as ADMIN, redirect to dashboard
    if (session?.user?.role === 'ADMIN') {
      redirect('/admin/dashboard');
    }
    
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0B1F33',
        background: 'linear-gradient(135deg, #0B1F33 0%, #0d2b47 50%, #0a1a2e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-inter), sans-serif'
      }}>
        {children}
      </div>
    );
  }

  // ── Authenticated ADMIN: full layout with sidebar ─────────────────────────
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5F7FA',
      display: 'flex',
      fontFamily: 'var(--font-inter), sans-serif',
      color: '#0B1F33'
    }}>
      <Sidebar />
      <div style={{
        marginLeft: '260px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative'
      }}>
        {children}
      </div>
    </div>
  );
}
