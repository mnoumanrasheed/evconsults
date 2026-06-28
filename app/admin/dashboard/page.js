import Link from 'next/link';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import { 
  FileText, 
  BookOpen, 
  Inbox, 
  Settings, 
  ArrowRight, 
  Plus, 
  MessageSquare 
} from 'lucide-react';

export const revalidate = 0; // Disable server-side caching for the dashboard

export default async function Dashboard() {
  const session = await auth();

  // Fetch counts from DB
  const [pageCount, blogCount, contactRequests, contactCounts] = await Promise.all([
    prisma.page.count(),
    prisma.blogPost.count(),
    prisma.contactRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    prisma.contactRequest.groupBy({
      by: ['status'],
      _count: true
    })
  ]);

  // Aggregate contact counts
  const newRequestsCount = contactCounts.find(c => c.status === 'NEW')?._count || 0;
  const totalRequestsCount = contactCounts.reduce((sum, c) => sum + c._count, 0);

  const stats = [
    { name: 'Total Pages', count: pageCount, icon: <FileText size={24} />, color: '#00AEEF', path: '/admin/pages' },
    { name: 'Blog Posts', count: blogCount, icon: <BookOpen size={24} />, color: '#8B5CF6', path: '/admin/blog' },
    { name: 'New Contact Requests', count: newRequestsCount, icon: <Inbox size={24} />, color: '#39D353', path: '/admin/contact-requests' },
    { name: 'Total Contact Requests', count: totalRequestsCount, icon: <MessageSquare size={24} />, color: '#F59E0B', path: '/admin/contact-requests' },
  ];

  return (
    <>
      <AdminHeader title="Dashboard Overview" userEmail={session?.user?.email} />

      <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Welcome Message */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '1.5rem 2rem',
          border: '1px solid #EEF1F5',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B1F33', margin: '0 0 0.5rem 0' }}>
            Welcome back, {session?.user?.name || 'Admin'}!
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#555555', margin: 0 }}>
            Here is what's happening on EVConsults today. Use the sidebar to update sections, write blogs, or review contact requests.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem'
        }}>
          {stats.map((stat, i) => (
            <div key={i} style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #EEF1F5',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                backgroundColor: `${stat.color}15`,
                color: stat.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {stat.icon}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#555555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {stat.name}
                </span>
                <span style={{ display: 'block', fontSize: '1.6rem', fontWeight: 800, color: '#0B1F33', marginTop: '0.1rem' }}>
                  {stat.count}
                </span>
              </div>
              <Link href={stat.path} style={{
                color: '#555555',
                display: 'flex',
                alignItems: 'center',
                alignSelf: 'stretch',
                paddingLeft: '0.5rem'
              }}>
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
        }} className="dashboard-grid">
          
          {/* Recent Contact Requests */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #EEF1F5',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem'
            }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0B1F33', margin: 0 }}>
                Recent Contact Requests
              </h3>
              <Link href="/admin/contact-requests" style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#00AEEF',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                View All <ArrowRight size={12} />
              </Link>
            </div>

            {contactRequests.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2.5rem 1rem',
                color: '#555555',
                fontSize: '0.9rem'
              }}>
                No contact requests received yet.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.88rem',
                  textAlign: 'left'
                }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #EEF1F5' }}>
                      <th style={{ padding: '0.75rem 0.5rem', color: '#555555', fontWeight: 600 }}>Name</th>
                      <th style={{ padding: '0.75rem 0.5rem', color: '#555555', fontWeight: 600 }}>City</th>
                      <th style={{ padding: '0.75rem 0.5rem', color: '#555555', fontWeight: 600 }}>Site Type</th>
                      <th style={{ padding: '0.75rem 0.5rem', color: '#555555', fontWeight: 600 }}>Status</th>
                      <th style={{ padding: '0.75rem 0.5rem', color: '#555555', fontWeight: 600 }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactRequests.map((req) => (
                      <tr key={req.id} style={{ borderBottom: '1px solid #F5F7FA' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: '#0B1F33' }}>{req.name}</td>
                        <td style={{ padding: '0.75rem 0.5rem', color: '#555555' }}>{req.city}</td>
                        <td style={{ padding: '0.75rem 0.5rem', color: '#555555' }}>{req.siteType}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span style={{
                            padding: '0.15rem 0.5rem',
                            borderRadius: '50px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.5px',
                            backgroundColor: req.status === 'NEW' ? 'rgba(57, 211, 83, 0.12)' : req.status === 'READ' ? 'rgba(0, 174, 239, 0.12)' : 'rgba(139, 92, 246, 0.12)',
                            color: req.status === 'NEW' ? '#39D353' : req.status === 'READ' ? '#00AEEF' : '#8B5CF6',
                          }}>
                            {req.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', color: '#94A3B8', fontSize: '0.8rem' }}>
                          {new Date(req.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <Link href="/admin/blog/new" style={{
              backgroundColor: '#0B1F33',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'between',
              gap: '2.5rem',
              boxShadow: 'var(--shadow-sm)',
              height: '140px'
            }}>
              <div>
                <Plus size={20} style={{ color: '#39D353', marginBottom: '0.5rem' }} />
                <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Create Blog Post</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.78rem', margin: '0.2rem 0 0 0' }}>Publish a new article to the insights section.</p>
              </div>
              <ArrowRight size={18} style={{ color: '#39D353', alignSelf: 'end' }} />
            </Link>

            <Link href="/admin/settings" style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'between',
              gap: '2.5rem',
              border: '1px solid #EEF1F5',
              boxShadow: 'var(--shadow-sm)',
              height: '140px'
            }}>
              <div>
                <Settings size={20} style={{ color: '#00AEEF', marginBottom: '0.5rem' }} />
                <h4 style={{ color: '#0B1F33', fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Global Settings</h4>
                <p style={{ color: '#555555', fontSize: '0.78rem', margin: '0.2rem 0 0 0' }}>Update phone, email, footer, or social links.</p>
              </div>
              <ArrowRight size={18} style={{ color: '#00AEEF', alignSelf: 'end' }} />
            </Link>
          </div>
        </div>
      </main>

      <style>{`
        @media (min-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 2fr 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
