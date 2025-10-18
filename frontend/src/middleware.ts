import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const tokenEdu = request.cookies.get("auth-token")?.value;
  const tokenPortal = request.cookies.get("portal-auth-token")?.value;
  const { pathname } = request.nextUrl;

  // ========================
  // === EDU SECTION (tidak diubah) ===
  // ========================
  if (pathname.startsWith("/edu")) {
    if (tokenEdu) {
      if (pathname === "/edu/login" || pathname === "/edu")
        return NextResponse.redirect(new URL("/edu/dashboard", request.url));
      return NextResponse.next();
    }

    if (pathname === "/edu/login") return NextResponse.next();

    const loginUrl = new URL("/edu/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ========================
  // === PORTAL SECTION (diperbaiki) ===
  // ========================
  if (pathname.startsWith("/portal")) {
    const isLoginPage =
      pathname === "/portal" || pathname.startsWith("/portal/verify");

    // ✅ Skip middleware saat proses verifikasi kode
    // agar cookie sempat tersimpan sebelum dicek
    if (pathname.startsWith("/api/portal/verify-code")) {
      return NextResponse.next();
    }

    // ✅ Skip sekali jika user baru datang dari halaman verify
    // (referer berisi /portal/verify)
    const referer = request.headers.get("referer") || "";
    if (
      pathname === "/portal/dashboard" &&
      referer.includes("/portal/verify")
    ) {
      return NextResponse.next();
    }

    // === Jika sudah login ===
    if (tokenPortal) {
      // Kalau sudah login tapi buka halaman login → arahkan ke dashboard
      if (isLoginPage) {
        return NextResponse.redirect(new URL("/portal/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // === Jika belum login ===
    // Hanya izinkan halaman login & verify
    if (!isLoginPage) {
      return NextResponse.redirect(new URL("/portal", request.url));
    }

    return NextResponse.next();
  }

  // Default
  return NextResponse.next();
}

export const config = {
  matcher: ["/edu/:path*", "/portal/:path*"],
};
