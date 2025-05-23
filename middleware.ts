import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { 
  adminLoginRoute, 
  adminRoute, 
  authRoute, 
  protectedRoute, 
  publicRoute, 
  userRoute 
} from "./route";
import { getToken } from "next-auth/jwt";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const basedUrl = process.env.BASED_URL;
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  // Helper functions to match paths with startsWith
  const matchesAny = (routes: string[], p: string) => 
    routes.some(route => p === route || p.startsWith(route + "/"));

  const isPublicRoute = matchesAny(publicRoute, path);
  const isAuthRoute = matchesAny(authRoute, path);
  const isAdminRoute = matchesAny(adminRoute, path);
  const isAdminLoginRoute = matchesAny(adminLoginRoute, path);
  const isProtectedRoute = matchesAny(protectedRoute, path);
  const isUserRoute = matchesAny(userRoute, path);

  // 1. Public routes - no auth needed
  if (isPublicRoute) return;

  // 2. Get token safely
  let token;
  try {
    token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production'
    });
  } catch (error) {
    console.error('Token retrieval error:', error);
    if (path.startsWith('/api')) {
      return new Response(JSON.stringify({ 
        error: 'Authentication error',
        message: 'Could not verify your session'
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    return Response.redirect(`${basedUrl}/auth-error`);
  }

  const role = token?.roleName;
  const isAdmin = role === "ADMIN";
  const isLoggedIn = !!token;

  console.log(`Middleware check - Role: ${role}, Path: ${path}`);

  // 3. Auth routes (login/signup) - redirect logged in users
  if (isLoggedIn && isAuthRoute) {
    return Response.redirect(`${basedUrl}`);
  }

  // 4. Admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(`${basedUrl}/admin-login`);
    }
    if (!isAdmin) {
      return Response.redirect(`${basedUrl}/access-denied`);
    }
    return; // allow admin access
  }

  // 5. Admin login route - redirect logged in admins
  if (isLoggedIn && isAdminLoginRoute) {
    return Response.redirect(`${basedUrl}/admin`);
  }

  // 6. Protected routes - redirect unauthenticated users
  if (!isLoggedIn && isProtectedRoute) {
    return Response.redirect(`${basedUrl}/login`);
  }

  // 7. User routes - restrict PUBLICUSER role
  if (isLoggedIn && role === "PUBLICUSER" && isUserRoute) {
    return Response.redirect(`${basedUrl}/access-denied`);
  }

  // 8. Default allow for all others (you can customize this)
  console.warn(`No explicit rule for route: ${path}, role: ${role}`);
});

export const config = {
  matcher: ["/((?!.*\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};