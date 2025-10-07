import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

export function middleware(request: NextRequest) {
    // @ts-ignore
    const token = cookies().get("secure-auth-token")?.value;
    const { pathname } = request.nextUrl

    if(token) {
        if(pathname === '/edu/login') {
            return NextResponse.redirect(new URL('/edu/dashboard', request.url));
        }

        return NextResponse.next()
    }

    const loginUrl = new URL('/edu/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ['/edu/:path*']
}