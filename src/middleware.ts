import { NextResponse, type NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  // Demo mode: just pass through all requests
  // When Supabase is configured, this will handle auth session refresh
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only match API routes and dashboard pages (not static files)
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
