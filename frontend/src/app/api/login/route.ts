import api from "@/app/lib/api";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    try {
        const res = await api.post("/lms/auth/login", { email, password });

        if (res.data.success) {
            // sesuai struktur respons API kamu
            const token = res.data.data.token;

            if (!token) {
                return new Response(JSON.stringify({ error: "Token required" }), {
                    status: 400,
                });
            }

            // set cookie langsung di handler
            const cookieStore = cookies();
            // @ts-ignore
            cookieStore.set("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7, // 1 minggu
                path: "/",
            });

            return new Response(JSON.stringify({ message: "Cookie stored" }), {
                status: 200,
            });
        }

        return new Response(JSON.stringify({ error: "Login failed" }), {
            status: 401,
        });
    } catch (err) {
        console.error("Login API error:", err);
        return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
        });
    }

}
