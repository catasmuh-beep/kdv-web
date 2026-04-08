import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") || "");

  const adminPassword = process.env.ADMIN_PASSWORD || "";

  if (!adminPassword) {
    return NextResponse.redirect(new URL("/login?error=env", request.url));
  }

  if (password !== adminPassword) {
    return NextResponse.redirect(new URL("/login?error=invalid", request.url));
  }

  const response = NextResponse.redirect(new URL("/admin", request.url));

  response.cookies.set("kdv_admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
  });

  return response;
}