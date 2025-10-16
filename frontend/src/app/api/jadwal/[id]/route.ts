import {NextRequest, NextResponse} from "next/server";
import api from "@/app/lib/api";
import {cookies} from "next/headers";

export async function DELETE(
    req: NextRequest, context: {params: Promise<{ id: string }>}
){
    const { id } = await context.params
    const cookieStore = cookies()
    // @ts-ignore
    const token = cookieStore.get('secure-auth-token')?.value

    try {
        const res = await api.delete(`/lms/schedules/${id}`, {
            headers : {
                Authorization: `Bearer ${token}`
            }
        })

        if(res.status === 200) {
            return NextResponse.json(res.data)
        }
    } catch (error) {
        return NextResponse.json(
            { error: (error as any)?.response?.data || (error as any)?.message || String(error) },
            { status: 500 }
        )
    }
}

export async function PUT(req: Request){
    const cookieStore = cookies()
    // @ts-ignore
    const token = cookieStore.get('secure-auth-token')?.value
    const body = await req.json()

    try {
        const res = await api.put(`/lms/schedules/${body.id}`, body, {
            headers : {
                Authorization: `Bearer ${token}`
            }
        })

        if(res.status === 200) {
            return NextResponse.json(res.data)
        }
    } catch (error) {
        return NextResponse.json(
            { error: (error as any)?.response?.data || (error as any)?.message || String(error) },
            { status: 500 }
        )
    }
}