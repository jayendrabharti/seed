import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { serverTrpc } from '@seed/api/server';

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('access-token')?.value;
  const refreshToken = cookieStore.get('refresh-token')?.value;

  // If no refresh token, user is not logged in - continue
  if (!refreshToken) {
    return NextResponse.next();
  }

  // Check if access token exists and is valid
  let isAccessTokenValid = false;
  if (accessToken) {
    try {
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);
      isAccessTokenValid = true;
    } catch {
      // Access token is invalid or expired
      isAccessTokenValid = false;
    }
  }

  // If access token is missing or invalid, refresh it
  if (!isAccessTokenValid) {
    try {
      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessTokenCookieOptions,
        refreshTokenCookieOptions,
      } = await serverTrpc.auth.getNewAccessToken.query({
        refreshToken,
      });

      // Set new tokens in cookies
      cookieStore.set('access-token', newAccessToken, accessTokenCookieOptions);
      cookieStore.set(
        'refresh-token',
        newRefreshToken,
        refreshTokenCookieOptions,
      );

      // Pass the new access token via request headers
      // so Server Components and tRPC can use it immediately
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('authorization', `Bearer ${newAccessToken}`);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // If refresh fails, clear invalid tokens
      cookieStore.delete('access-token');
      cookieStore.delete('refresh-token');

      // Only redirect if not already on auth pages
      const isAuthPage =
        request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/auth') ||
        request.nextUrl.pathname === '/';

      if (!isAuthPage) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }

      // On auth pages and home, just continue without tokens
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except static files, API routes, and Next.js internal routes
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
