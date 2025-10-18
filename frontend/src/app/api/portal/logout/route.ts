import { NextResponse } from "next/server";

/**
 * API Logout Portal
 * Menghapus cookie portal-auth-token (HttpOnly)
 */
export async function GET() {
  const res = NextResponse.json({ success: true, message: "Logout berhasil" });

  res.cookies.set("portal-auth-token", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  return res;
}
