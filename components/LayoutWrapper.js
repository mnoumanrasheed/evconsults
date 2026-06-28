'use client';
import { usePathname } from 'next/navigation';
import PageLoader from './PageLoader';
import AIChatbot from './AIChatbot';

export default function LayoutWrapper({ children, navbar, footer, whatsapp }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <div className="admin-root">{children}</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PageLoader />
      {navbar}
      <main style={{ paddingTop: '74px', flex: '1 0 auto' }}>
        {children}
      </main>
      {footer}
      {whatsapp}
      <AIChatbot />
    </div>
  );
}
