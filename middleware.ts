import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const adminCookie = req.cookies.get("catas_admin")?.value;

  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (adminCookie !== "1") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
