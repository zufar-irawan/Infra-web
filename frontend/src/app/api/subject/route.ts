import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import api from "@/app/lib/api";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) return NextResponse.json({ error: "Token tidak ada!" }, { status: 401 });

    try {
        const res = await api.get("/lms/subjects", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        if(res.status === 200){
            return NextResponse.json(res.data);
        }
        return NextResponse.json({ error: "Gagal mengambil data mata pelajaran" }, { status: res.status });
    } catch (error: any) {
        const status = error?.response?.status ?? 500;
        const data = error?.response?.data ?? { error: "Terjadi kesalahan pada server" };
        return NextResponse.json(data, { status });
    }
}
