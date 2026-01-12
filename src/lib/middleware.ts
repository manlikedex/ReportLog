import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { hasAtLeastRole } from "@/lib/authz";

const PUBLIC_PATHS = [
  "/login",
  "/api/auth", // nextauth endpoints
  "/favicon.ico",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow public paths
  if (isPublicPath(pathname)) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Not signed in
  if (!token) {
    // For API routes return 401 JSON
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For pages redirect to login
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Role-based protection for "edit/update" endpoints (ADMIN+)
  const role = (token as any).staffRole;

  // pages
  if (pathname.startsWith("/cases/") && pathname.endsWith("/edit")) {
    if (!hasAtLeastRole(role, "ADMIN")) {
      const url = req.nextUrl.clone();
      url.pathname = "/cases";
      return NextResponse.redirect(url);
    }
  }

  // api routes
  if (pathname.startsWith("/api/cases/") && pathname.endsWith("/update")) {
    if (!hasAtLeastRole(role, "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|robots.txt).*)",
  ],
};
