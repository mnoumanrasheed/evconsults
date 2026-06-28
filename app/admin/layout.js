import { auth } from '@/auth';
import Sidebar from '@/components/admin/Sidebar';

export const metadata = {
  title: 'EVConsults Admin Portal',
  description: 'Manage website content, blog posts, contact requests, and global settings.',
};

export default async function AdminLayout({ children }) {
  const session = await auth();

  // If not logged in, render children (e.g. login page) without sidebar
  if (!session) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F5F7FA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-inter), sans-serif'
      }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5F7FA',
      display: 'flex',
      fontFamily: 'var(--font-inter), sans-serif',
      color: '#0B1F33'
    }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
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
