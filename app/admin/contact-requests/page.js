import { auth } from '@/auth';
import { listContactRequests } from '@/lib/actions/contact';
import AdminHeader from '@/components/admin/AdminHeader';
import ContactRequestsClient from './ContactRequestsClient';

export const revalidate = 0;

export default async function ContactRequestsAdminPage() {
  const session = await auth();
  const requests = await listContactRequests();

  return (
    <>
      <AdminHeader title="Manage Lead Contact Requests" userEmail={session?.user?.email} />
      
      <main style={{ padding: '2rem' }}>
        <ContactRequestsClient initialRequests={requests} />
      </main>
    </>
  );
}
