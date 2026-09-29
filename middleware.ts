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

  // Define auth routes (pages accessible without authentication)
  const authRoutes = [
    '/auth/login',
    '/auth/sign-up',
    '/auth/forgot-password',
    '/auth/update-password',
    '/auth/confirm',
  ];
  
  // Define other public routes (non-auth pages that don't require login)
  const otherPublicRoutes = [
    '/demo-test', // Automated test page
  ];

  const pathname = request.nextUrl.pathname;
  
  // Check if this is an auth page
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  
  // Check if this is a public non-auth route
  const isOtherPublicRoute = otherPublicRoutes.some((route) => pathname.startsWith(route));
  
  // Check if this is an API request
  const isApiRoute = pathname.startsWith('/api/');
  
  // Check if this is the root page (exact match only)
  const isRootPage = pathname === '/';

  // AUTHENTICATED USER BEHAVIOR
  if (user) {
    // Redirect authenticated users away from auth pages to main app
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Allow access to root page and all other routes
    return response;
  }

  // UNAUTHENTICATED USER BEHAVIOR
  if (!user) {
    // Allow access to auth pages
    if (isAuthRoute) {
      return response;
    }
    
    // Allow access to other public routes (like /demo-test)
    if (isOtherPublicRoute) {
      return response;
    }
    
    // Allow access to API routes (Demo Mode support)
    // APIs currently return demo data for unauthenticated users
    if (isApiRoute) {
      return response;
    }
    
    // Redirect unauthenticated users from root page to login
    if (isRootPage) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    // For any other route, allow access (for assets, etc.)
    return response;
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
