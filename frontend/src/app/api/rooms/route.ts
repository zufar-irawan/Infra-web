import {cookies} from "next/headers";
import api from "@/app/lib/api";
import {NextResponse} from "next/server";

export async function GET() {
    const cookieStore = cookies()
    // @ts-ignore
    const token = cookieStore.get('secure-auth-token')?.value

    try {
        const res = await api.get('/lms/rooms', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        if (res.status === 200) {
            return NextResponse.json(res.data)
        }
    } catch (e:any) {
        return NextResponse.json(
            { error: e?.response?.data || e?.message || String(e) },
            { status: 500 }
        )
    }
}
