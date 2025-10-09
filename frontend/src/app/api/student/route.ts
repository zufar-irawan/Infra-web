import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";
import api from "@/app/lib/api";

export async function GET(res: NextRequest) {
    const { searchParams } = new URL(res.url);
    const id = searchParams.get("id");
    const cookieStore = cookies()
    //@ts-ignore
    const token = cookieStore.get("secure-auth-token")?.value;

    if(!token) return NextResponse.json({ error: "Token tidak ada!" }, { status: 401 });

    try {
        const res = await api.get("/lms/students/" + id, {
            headers : {
                Authorization: `Bearer ${token}`
            }
        })

        if (res.status === 200) {
            return NextResponse.json(res.data)
        }
    } catch (e) {
        return NextResponse.json({ error: e });
    }
}