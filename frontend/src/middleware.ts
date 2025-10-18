import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const tokenEdu = request.cookies.get("auth-token")?.value;
  const tokenPortal = request.cookies.get("portal-auth-token")?.value;
  const { pathname } = request.nextUrl;

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

  // === PORTAL SECTION ===
  if (pathname.startsWith("/portal")) {
    const isLoginPage =
      pathname === "/portal" || pathname.startsWith("/portal/verify");

    if (tokenPortal) {
      // Kalau sudah login tapi buka halaman login → arahkan ke dashboard
      if (isLoginPage)
        return NextResponse.redirect(
          new URL("/portal/dashboard", request.url)
        );
      return NextResponse.next();
    }

    // Kalau belum login tapi buka dashboard → arahkan ke login
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