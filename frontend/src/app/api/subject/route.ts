import {cookies} from "next/headers";
import api from "@/app/lib/api";
import {NextResponse} from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('secure-auth-token')?.value;

    try {
        const res = await api.get("/lms/subjects", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(res.status === 200) {
            return NextResponse.json(res.data)
        }
    } catch (error) {
        return NextResponse.json({ error: error }, {status: 500})
    }
}