import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isAuthRoute =
    pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isAdminRoute = pathname.startsWith('/admin');
  const isAccountRoute = pathname.startsWith('/account');
  const isCheckoutRoute = pathname.startsWith('/checkout');

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL('/login?callbackUrl=' + pathname, req.url)
      );
    }
    if (
      req.auth?.user?.role !== 'ADMIN' &&
      req.auth?.user?.role !== 'SUPER_ADMIN'
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  if (isAccountRoute || isCheckoutRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL('/login?callbackUrl=' + pathname, req.url)
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
