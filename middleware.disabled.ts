import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sadece admin sayfasını koru
  if (pathname.startsWith("/admin")) {
    const isAdmin = request.cookies.get("kdv_admin")?.value === "1";

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
