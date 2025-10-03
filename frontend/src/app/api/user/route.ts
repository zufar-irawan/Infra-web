import { NextResponse } from "next/server";
// Import helper server yang sudah ada
import { getAuthenticatedUser } from "@/app/lib/Auth";

/**
 * Mendapatkan data user dari cookie yang tersimpan di sisi server.
 * Endpoint ini dipanggil oleh Client Component untuk mendapatkan status autentikasi.
 * URL: /api/user
 */
export async function GET() {
    // 1. Panggil helper untuk mendapatkan data user
    const user = getAuthenticatedUser();

    if (!user) {
        // Jika tidak ada user (cookie tidak ada atau tidak valid), kembalikan status 401
        return NextResponse.json({ message: "Tidak terautentikasi" }, { status: 401 });
    }

    // 2. Jika user ditemukan, kembalikan data user
    return NextResponse.json({ user }, { status: 200 });
}
