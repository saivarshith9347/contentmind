import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Development-time validation (safe - no credential exposure)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('[Middleware] Missing Supabase environment variables:');
    console.error('  NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'present' : 'MISSING');
    console.error('  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:', supabaseKey ? 'present (length: ' + supabaseKey.length + ')' : 'MISSING');
  }
  
  if (supabaseUrl && !supabaseUrl.includes('.supabase.co')) {
    console.error('[Middleware] Invalid NEXT_PUBLIC_SUPABASE_URL format.');
    console.error('  Expected: https://[project-id].supabase.co');
    console.error('  Got URL format:', supabaseUrl.substring(0, 20) + '...');
  }

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define public routes (pages accessible without auth)
  const publicRoutes = [
    '/', // Home page with Demo Mode
    '/auth/login',
    '/auth/sign-up',
    '/auth/forgot-password',
    '/auth/update-password',
    '/auth/confirm',
  ];
  
  // Define protected routes (require authentication)
  const protectedRoutes = [
    '/dashboard',
    '/strategy',
    '/memory',
    '/gaps',
    '/learning',
  ];

  // Define auth routes (redirect to home if authenticated)
  const authRoutes = ['/auth/login', '/auth/sign-up'];

  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route)
  );
  
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  
  // Check if this is an API request
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/');

  // Redirect authenticated users away from auth pages
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // For API routes: return JSON 401 for protected APIs (none currently, all public for Demo Mode)
  // API routes are currently public to support Demo Mode without authentication
  // If you want to protect specific APIs, add logic here
  
  // For protected page routes: redirect unauthenticated users to login
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
