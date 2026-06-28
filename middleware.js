import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow login page through (avoid redirect loop)
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const session = await auth();

  // Unauthenticated — redirect to login
  if (!session) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Non-admin role — redirect to home
  if (session.user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
