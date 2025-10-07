import {NextRequest, NextResponse} from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("secure-auth-token")?.value;
    const { pathname } = request.nextUrl

    if(token) {
        if(pathname === '/edu/login') {
            return NextResponse.redirect(new URL('/edu/dashboard', request.url));
        }

        if (pathname === '/edu') {
            return NextResponse.redirect(new URL('/edu/dashboard', request.url));
        }
        return NextResponse.next()
    }

    if (pathname === '/edu/login') {
        return NextResponse.next();
    }

    if (pathname === '/edu') {
        return NextResponse.redirect(new URL('/edu/login', request.url));
    }

    const loginUrl = new URL('/edu/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ['/edu/:path*']
}