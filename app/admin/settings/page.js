import { auth } from '@/auth';
import { getGlobalSettings } from '@/lib/actions/settings';
import AdminHeader from '@/components/admin/AdminHeader';
import SettingsClient from '@/components/admin/settings/SettingsClient';

export const revalidate = 0;

export default async function SettingsPage() {
  const session = await auth();
  
  // Fetch settings records (returns an object { contact, social, seo, footer })
  const settings = await getGlobalSettings(['contact', 'social', 'seo', 'footer']);

  return (
    <>
      <AdminHeader title="Global Website Settings" userEmail={session?.user?.email} />
      
      <main style={{ padding: '2rem' }}>
        <SettingsClient initialSettings={settings} />
      </main>
    </>
  );
}
