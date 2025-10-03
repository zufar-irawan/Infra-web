import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import api from "@/app/lib/api"; // Digunakan untuk memanggil API logout backend jika ada

// Nama cookie harus sama persis dengan yang digunakan saat login
const TOKEN_NAME = "token"
const USER_DATA_NAME = "user_data"

export async function POST(request: Request) {

    try {

        // @ts-ignore
        const token = cookies().get(TOKEN_NAME)?.value;
        if (token) {
           await api.post("/lms/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
        }

        // @ts-ignore
        cookies().set(TOKEN_NAME, '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: '/',
            maxAge: 0,
        })

        // @ts-ignore
        cookies().set(USER_DATA_NAME, '', {
            secure: process.env.NODE_ENV === "production",
            path: '/',
            maxAge: 0,
        })

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error: any) {
        console.error("Error saat logout API backend:", error);

        // @ts-ignore
        cookies().set(TOKEN_NAME, '', { maxAge: 0, path: '/' });

        // @ts-ignore
        cookies().set(USER_DATA_NAME, '', { maxAge: 0, path: '/' });

        return NextResponse.json({ success: true, message: "Logged out locally" }, { status: 200 });
    }
}
