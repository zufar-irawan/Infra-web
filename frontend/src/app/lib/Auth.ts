import { cookies } from "next/headers";
// import 'server-only';

// Definisikan ulang interface UserData
export interface UserData {
    id: number;
    name: string;
    email: string;
    role: "siswa" | "guru" | "admin";
}

const USER_DATA_NAME = "user_data"; // Harus sama dengan nama cookie di route.ts

/**
 * Mengambil data user yang tersimpan di cookie.
 * Fungsi ini harus dipanggil di lingkungan Server (Server Component atau Route Handler).
 * @returns UserData | null
 */
export function getAuthenticatedUser(): UserData | null {
    try {
        // @ts-ignore
        const userCookie = cookies().get(USER_DATA_NAME);

        if (!userCookie || !userCookie.value) {
            return null;
        }

        // Cookie disimpan sebagai JSON string, harus di-parse kembali
        const userData = JSON.parse(userCookie.value);

        // Validasi tipe data dasar (opsional, tapi disarankan)
        if (typeof userData === 'object' && userData !== null && 'id' in userData && 'name' in userData) {
            return userData as UserData;
        }

        return null;

    } catch (error) {
        console.error("Gagal mengambil atau mem-parse data user dari cookie:", error);
        return null;
    }
}
