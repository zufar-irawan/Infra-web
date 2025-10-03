import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import api from "@/app/lib/api"; // Pastikan ini mengarah ke instance Axios Anda

// --- INTERFACES DAN HELPER ---

interface UserData {
    id: number
    name: string
    email: string
    role: "siswa" | "guru" | "admin"
}

interface LoginResponse {
    user : UserData
    token: string
    token_type: string
}

const TOKEN_NAME = "token"
const USER_DATA_NAME = "user_data"

function serializeUser(user: UserData): string {
    const dataToStore = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }
    return JSON.stringify(dataToStore)
}

// --- FUNGSI ROUTE HANDLER ---

export async function POST(request: Request) {

    // 1. Ambil body request dari frontend
    const { email, password } = await request.json();

    try {
        // 2. Panggil API Backend (lms/user/login)
        const response = await api.post<any, { data: { data: LoginResponse } }>(
            "/lms/auth/login",
            {email, password},
        );

        const { token, user } = response.data.data; // Sesuaikan dengan struktur respons API Anda
        const serializedUser = serializeUser(user);

        // 3. SET COOKIE

        // Token (HTTP-Only)
        // @ts-ignore
        cookies().set(TOKEN_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        })

        // Data User (Non-HTTP-Only, agar bisa dibaca Client Component)
        // @ts-ignore
        cookies().set(USER_DATA_NAME, serializedUser, {
            secure: process.env.NODE_ENV === "production", // Gunakan process.env
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        })

        // 4. Kembalikan respons sukses ke klien frontend
        // Kita mengembalikan objek { success: true } sesuai permintaan sebelumnya.
        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error: any) {
        // Tangani error Axios
        const message = error.response?.data?.message || "login gagal";
        const status = error.response?.status || 401;

        return NextResponse.json({ message: message }, { status: status });
    }
}
