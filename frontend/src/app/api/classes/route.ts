import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import api from "@/app/lib/api";

export async function GET(){
    const cookieStore = cookies()
    // @ts-ignore
    const token = cookieStore.get('secure-auth-token')?.value

    if(!token) return NextResponse.json({error: 'Unauthorized'}, {status: 401})

    try {
        const res = await api.get('/lms/classes', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        return NextResponse.json(res.data)
    } catch (error) {
        return NextResponse.json({error: 'Failed to fetch classes'}, {status: 500})
    }
}