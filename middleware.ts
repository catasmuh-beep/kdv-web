import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const adminCookie = req.cookies.get("kdv_admin")?.value;

  // Sadece admin alanını koru
  if (pathname.startsWith("/admin")) {
    if (adminCookie !== "1") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Login sayfasına girilmiş ve zaten giriş yapılmışsa admin'e gönder
  if (pathname === "/login" && adminCookie === "1") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};