import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PRIVATE_ROUTES = ['/profile', '/notes'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user has auth cookie
  const hasAuthCookie = request.cookies.has('accessToken') || request.cookies.has('refreshToken');

  // Check if current route is private
  const isPrivateRoute = PRIVATE_ROUTES.some(route => pathname.startsWith(route));
  
  // Check if current route is auth route
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

  // Redirect unauthorized users from private routes to sign-in
  if (isPrivateRoute && !hasAuthCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Redirect authorized users from auth routes to profile
  if (isAuthRoute && hasAuthCookie) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};

