import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from './lib/api/serverApi';

const PRIVATE_ROUTES = ['/profile', '/notes'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user has auth cookies
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;
  
  let isAuthenticated = !!accessToken;

  // If no accessToken but has refreshToken, try to refresh session
  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();
      if (sessionResponse.data.success) {
        isAuthenticated = true;
        // Update cookies if new tokens were set
        const setCookie = sessionResponse.headers['set-cookie'];
        if (setCookie) {
          const response = NextResponse.next();
          const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
          for (const cookieStr of cookieArray) {
            const [nameValue, ...options] = cookieStr.split(';');
            const [name, value] = nameValue.split('=');
            if (name && value) {
              response.cookies.set(name.trim(), value.trim());
            }
          }
          // After successful session refresh, re-check route logic
          const isPrivateRoute = PRIVATE_ROUTES.some(route => pathname.startsWith(route));
          const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
          
          // If user is now authenticated and on auth route, redirect to profile
          if (isAuthRoute && isAuthenticated) {
            return NextResponse.redirect(new URL('/profile', request.url));
          }
          
          return response;
        }
      }
    } catch (error) {
      // Session refresh failed, user is not authenticated
      isAuthenticated = false;
    }
  }

  // Check if current route is private
  const isPrivateRoute = PRIVATE_ROUTES.some(route => pathname.startsWith(route));

  // Check if current route is auth route
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

  // Redirect unauthorized users from private routes to sign-in
  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Redirect authorized users from auth routes to profile
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};

