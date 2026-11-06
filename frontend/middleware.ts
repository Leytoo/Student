import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type UserRole = 'STUDENT' | 'REGISTRAR' | 'SAO' | 'LIBRARIAN' | 'ADMIN';

interface DecodedUser {
  id: string;
  role: UserRole;
  email: string;
  exp?: number;
}

const ROLE_ROUTE_MAP: Record<string, UserRole> = {
  student: 'STUDENT',
  registrar: 'REGISTRAR',
  sao: 'SAO',
  librarian: 'LIBRARIAN',
  admin: 'ADMIN',
};

/**
 * Edge-compatible JWT payload extractor without external library overhead.
 */
function decodeJwtPayloadEdge(token: string): DecodedUser | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
    const decoded = JSON.parse(jsonPayload);

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null;
    }

    return decoded as DecodedUser;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Determine if the current path is a protected role route
  const pathSegment = pathname.split('/')[1]?.toLowerCase();
  const requiredRole = pathSegment ? ROLE_ROUTE_MAP[pathSegment] : undefined;

  // 1. Handling Protected Role Routes (/student, /registrar, /sao, /librarian, /admin)
  if (requiredRole) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const user = decodeJwtPayloadEdge(token);

    if (!user) {
      // Invalid or expired token: clear cookie and redirect to login
      const response = NextResponse.redirect(new URL('/login?error=session_expired', request.url));
      response.cookies.delete('auth_token');
      return response;
    }

    // Strict RBAC isolation: Reject mismatched roles immediately
    if (user.role !== requiredRole) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  }

  // 2. Prevent already authenticated users from seeing the /login page
  if (pathname === '/login' && token) {
    const user = decodeJwtPayloadEdge(token);
    if (user) {
      const rolePath = user.role.toLowerCase();
      return NextResponse.redirect(new URL(`/${rolePath}`, request.url));
    }
  }

  // 3. Root redirect: redirect to /login or respective dashboard
  if (pathname === '/') {
    if (token) {
      const user = decodeJwtPayloadEdge(token);
      if (user) {
        return NextResponse.redirect(new URL(`/${user.role.toLowerCase()}`, request.url));
      }
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/student/:path*',
    '/registrar/:path*',
    '/sao/:path*',
    '/librarian/:path*',
    '/admin/:path*',
  ],
};

