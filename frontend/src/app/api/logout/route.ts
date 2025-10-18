import {cookies} from "next/headers";
import api from "@/app/lib/api";
import {NextResponse} from "next/server";

export async function POST() {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    // Jika tidak ada token, langsung hapus cookie dan return success
    if (!token) {
        cookieStore.delete("auth-token");
        return NextResponse.json({ message: "Logout successful", logout: true }, { status: 200 });
    }

    try {
        // Perbaikan: Headers ditempatkan sebagai parameter ketiga
        const res = await api.post("/lms/auth/logout", {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Hapus cookie setelah logout berhasil
        cookieStore.delete("auth-token");

        return NextResponse.json({
            message: "Logout successful",
            logout: true,
            data: res.data
        }, { status: 200 });

    } catch (error: any) {
        console.error("Logout error:", error);

        // Hapus cookie meski backend error (force logout)
        cookieStore.delete("auth-token");

        // Error handling yang lebih spesifik
        if (error.response) {
            // Backend mengembalikan response error
            return NextResponse.json({
                error: error.response.data?.message || "Logout failed",
                logout: true // Tetap return true karena cookie sudah dihapus
            }, { status: 200 }); // Return 200 karena frontend logout berhasil
        } else if (error.request) {
            // Network error
            return NextResponse.json({
                error: "Network error - could not reach server",
                logout: true
            }, { status: 200 });
        } else {
            // Error lainnya
            return NextResponse.json({
                error: error.message || "Unknown error occurred",
                logout: true
            }, { status: 200 });
        }
    }
}