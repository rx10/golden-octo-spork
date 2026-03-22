import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from 'jose';

const protectedRoutes = ['/dashboard', '/onboarding', '/resumes', '/settings', '/jobs'];
const authRoutes = ['/login', '/signup'];

function isSessionValid(cookieValue: string): boolean {
  try {
    const payload = decodeJwt(cookieValue);
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  const sessionCookie = request.cookies.get('socratic_session');
  const hasValidSession = sessionCookie ? isSessionValid(sessionCookie.value) : false;

  if (isProtectedRoute && !hasValidSession) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    if (sessionCookie) {
      response.cookies.delete('socratic_session');
    }
    return response;
  }

  if (isAuthRoute && hasValidSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
