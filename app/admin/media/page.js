import { auth } from '@/auth';
import { listMedia } from '@/lib/actions/media';
import AdminHeader from '@/components/admin/AdminHeader';
import MediaLibraryClient from './MediaLibraryClient';

export const revalidate = 0;

export default async function MediaAdminPage() {
  const session = await auth();
  const media = await listMedia();

  return (
    <>
      <AdminHeader title="Media Asset Library" userEmail={session?.user?.email} />
      
      <main style={{ padding: '2rem' }}>
        <MediaLibraryClient initialMedia={media} />
      </main>
    </>
  );
}
