import Link from 'next/link';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import { Edit3, Eye, FileText } from 'lucide-react';

export const revalidate = 0;

export default async function PagesList() {
  const session = await auth();

  // Fetch list of pages with section counts
  const pages = await prisma.page.findMany({
    orderBy: { slug: 'asc' },
    include: {
      _count: {
        select: { sections: true }
      }
    }
  });

  const pageRoutes = {
    home: '/',
    about: '/about',
    services: '/services',
    licensing: '/licensing',
    industries: '/industries',
    blog: '/blog',
    contact: '/contact',
  };

  return (
    <>
      <AdminHeader title="Manage Page Content" userEmail={session?.user?.email} />

      <main style={{ padding: '2rem' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #EEF1F5',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden'
        }}>
          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9rem',
              textAlign: 'left'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#F8FAFC',
                  borderBottom: '1px solid #EEF1F5'
                }}>
                  <th style={{ padding: '1rem 1.5rem', color: '#555555', fontWeight: 600 }}>Page Name</th>
                  <th style={{ padding: '1rem 1.5rem', color: '#555555', fontWeight: 600 }}>Slug</th>
                  <th style={{ padding: '1rem 1.5rem', color: '#555555', fontWeight: 600 }}>Editable Sections</th>
                  <th style={{ padding: '1rem 1.5rem', color: '#555555', fontWeight: 600 }}>Last Updated</th>
                  <th style={{ padding: '1rem 1.5rem', color: '#555555', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.id} className="admin-pages-row">
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#0B1F33' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={16} style={{ color: '#00AEEF' }} />
                        {page.title}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#555555' }}>
                      <code>/{page.slug === 'home' ? '' : page.slug}</code>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#555555' }}>
                      <span style={{
                        padding: '0.15rem 0.5rem',
                        backgroundColor: 'rgba(0, 174, 239, 0.08)',
                        color: '#00AEEF',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}>
                        {page._count.sections} Sections
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#94A3B8', fontSize: '0.82rem' }}>
                      {new Date(page.updatedAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'end', gap: '0.75rem' }}>
                        <Link
                          href={pageRoutes[page.slug] || `/${page.slug}`}
                          target="_blank"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.4rem 0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #E2E8F0',
                            color: '#555555',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            backgroundColor: '#ffffff'
                          }}
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </Link>
                        <Link
                          href={`/admin/pages/${page.slug}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.4rem 0.75rem',
                            borderRadius: '6px',
                            backgroundColor: '#00AEEF',
                            color: '#ffffff',
                            fontSize: '0.8rem',
                            fontWeight: 600
                          }}
                        >
                          <Edit3 size={14} />
                          <span>Edit Content</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <style>{`
        .admin-pages-row {
          border-bottom: 1px solid #EEF1F5;
          transition: background-color 0.2s;
        }
        .admin-pages-row:hover {
          background-color: #F8FAFC;
        }
      `}</style>
    </>
  );
}
