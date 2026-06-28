import { auth } from '@/auth';
import { listBlogPosts } from '@/lib/actions/blog';
import AdminHeader from '@/components/admin/AdminHeader';
import BlogListClient from './BlogListClient';

export const revalidate = 0;

export default async function BlogAdminPage() {
  const session = await auth();
  const posts = await listBlogPosts();

  return (
    <>
      <AdminHeader title="Manage Blog Posts" userEmail={session?.user?.email} />
      
      <main style={{ padding: '2rem' }}>
        <BlogListClient initialPosts={posts} />
      </main>
    </>
  );
}
