import { notFound } from 'next/navigation';
import { getPostById } from '@/lib/actions/blog';
import EditBlogPostForm from './EditBlogPostForm';

export const revalidate = 0;

export default async function EditBlogPage({ params }) {
  const id = params.id;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return <EditBlogPostForm post={post} />;
}
