import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from 'jose';

const protectedRoutes = ['/dashboard', '/settings', '/profile'];

function isSessionValid(cookieValue: string): boolean {
  try {
    const payload = decodeJwt(cookieValue);
    // If the JWT has an `exp` claim, check it against current time
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return false;
    }
    return true;
  } catch {
    // If the cookie isn't even a valid JWT, treat it as invalid
    return false;
  }
}

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/signup');

  const sessionCookie = request.cookies.get('socratic_session');
  const hasValidSession = sessionCookie ? isSessionValid(sessionCookie.value) : false;

  // If trying to access a protected route without a valid session, redirect to login
  if (isProtectedRoute && !hasValidSession) {
    // Also clear the stale cookie if it exists but is expired
    const response = NextResponse.redirect(new URL('/login', request.url));
    if (sessionCookie && !hasValidSession) {
      response.cookies.delete('socratic_session');
    }
    return response;
  }

  // If trying to access login/signup while already logged in, redirect to dashboard
  if (isAuthRoute && hasValidSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
