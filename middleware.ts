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

  // 1. First handle public routes that don't need authentication
  if (publicRoute.includes(path)) {
    return; // Allow access without any checks
  }

  // 2. Safely retrieve token with error handling
  let token;
  try {
    token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production'
    });
    
    if (!token) {
      console.warn('No token found for protected route:', path);
      if (protectedRoute.includes(path) || adminRoute.includes(path)) {
        return Response.redirect(`${basedUrl}/login`);
      }
      return;
    }
  } catch (error) {
    console.error('Token retrieval error:', error);
    // For API routes, return JSON error
    if (path.startsWith('/api')) {
      return new Response(JSON.stringify({ 
        error: 'Authentication error',
        message: 'Could not verify your session'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    return Response.redirect(`${basedUrl}/auth-error`);
  }

  const role = token?.roleName;
  const isAdmin = role === "ADMIN";
  const isLoggedIn = !!token; // Use token presence instead of req.auth for reliability

  console.log(`Access Attempt: Role=${role}, Path=${path}`);

  // 3. Handle auth routes (login/signup) for already authenticated users
  if (isLoggedIn && authRoute.includes(path)) {
    return Response.redirect(`${basedUrl}`);
  }

  // 4. Handle admin-specific routes
  if (adminRoute.includes(path)) {
    if (!isLoggedIn) {
      return Response.redirect(`${basedUrl}/admin-login`);
    }
    if (!isAdmin) {
      console.warn(`Non-admin user attempted to access admin route: ${role} at ${path}`);
      return Response.redirect(`${basedUrl}/access-denied`);
    }
    return; // Allow admin access
  }

  // 5. Handle admin login route for already logged-in admins
  if (isLoggedIn && adminLoginRoute.includes(path)) {
    return Response.redirect(`${basedUrl}/admin`);
  }

  // 6. Handle protected routes for unauthenticated users
  if (!isLoggedIn && protectedRoute.includes(path)) {
    return Response.redirect(`${basedUrl}/login`);
  }

  // 7. Handle user routes for non-authorized roles
  if (isLoggedIn && role === "PUBLICUSER" && userRoute.includes(path)) {
    console.warn(`Public user attempted to access user route: ${path}`);
    return Response.redirect(`${basedUrl}/access-denied`);
  }

  // Default allow with warning for unhandled cases
  console.warn(`No explicit rule for route: ${path}, role: ${role}`);
});

export const config = {
  matcher: ["/((?!.*\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};