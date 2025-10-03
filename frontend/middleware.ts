//middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest} from "next/server";

export function middleware(req: NextRequest, res: NextResponse) {
    const token = req.cookies.get("token")?.value
    const {pathname} = req.nextUrl

    if(pathname.startsWith("/edu/login")){
        return NextResponse.next
    }

    if(pathname.startsWith("/edu") && !token){
        return NextResponse.redirect(new URL("/edu/login", req.url))
    }

    return NextResponse.next
}

export const config = {
    matcher: ["/edu/:path*"]
}