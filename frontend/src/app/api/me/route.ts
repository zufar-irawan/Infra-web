import api from "@/app/lib/api";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";

export interface User {
    id: number;
    name: string;
    email: string;
    role: "siswa" | "guru" | "admin";
    phone: string;
    status: "aktif" | "nonaktif"
}

export async function GET() {
    const cookieStore = await cookies()

    // @ts-ignore
    const token = cookieStore.get("auth-token")?.value;

    if (!token) return NextResponse.json({ error: "Token tidak ada!" }, { status: 401 });

    try {
        const res = await api.get("/lms/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        return NextResponse.json(res.data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}