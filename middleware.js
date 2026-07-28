import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // ── Helper: build a response that forwards the pathname as a header ────────
  // The admin layout reads x-pathname to know whether it is rendering
  // /admin/login so it can suppress the sidebar unconditionally on that route.
  const nextWithPathname = () => {
    const res = NextResponse.next({
      request: {
        headers: new Headers({
          ...Object.fromEntries(request.headers.entries()),
          'x-pathname': pathname,
        }),
      },
    });
    return res;
  };

  // Allow the login page through (avoid redirect loop)
  if (pathname === '/admin/login') {
    // If already authenticated as ADMIN, redirect away from login
    const session = await auth();
    if (session?.user?.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    // Pass through but still inject pathname so layout knows it's /admin/login
    return nextWithPathname();
  }

  // All other /admin/* routes — require a valid authenticated ADMIN session
  let session = null;
  try {
    session = await auth();
  } catch {
    // JWT decode failure or missing secret — treat as unauthenticated
    session = null;
  }

  // Not authenticated at all
  if (!session || !session.user) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated but not an ADMIN (wrong role)
  if (session.user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // ✅ Valid ADMIN — allow through, attach security + pathname headers
  const response = nextWithPathname();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, private'
  );
  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
