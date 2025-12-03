import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const { pathname } = req.nextUrl;

  // If user is on a public page → allow
  if (PUBLIC_ROUTES.includes(pathname)) {
    if (token) {
      // Already logged in? redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // All other routes treated as protected
  if (!token) {
    // Redirect BEFORE hitting the route
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname); 
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      Match everything except static files
      - "/(.*)" matches all routes 
      - ":path*" excludes next/static, images, _next, favicon
    */
    "/((?!_next|static|favicon.ico|images).*)",
  ],
};
