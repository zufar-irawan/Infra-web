import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import api from "@/app/lib/api";

export async function GET() {
    const cookieStore = cookies()
    // @ts-ignore
    const token = cookieStore.get('secure-auth-token')?.value;

    if (!token) return NextResponse.json({ error: "Token tidak ada!" }, { status: 401 });

    try {
        const res = await api.get("/lms/assignments", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        if(res.status === 200){
            return NextResponse.json(res.data);
        }
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}