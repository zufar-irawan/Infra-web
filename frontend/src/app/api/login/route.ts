import api from "@/app/lib/api";
import {NextResponse} from "next/server";
import { cookies} from "next/headers";

export async function POST(req: Request){
    const {email, password} = await req.json();

    try {
        const cookieStore = await cookies()
        const res = await api.post("/lms/auth/login", {email, password});

        if(res.status === 200){
            const token: string | undefined = res?.data?.data?.token;
            const user = res?.data?.data?.user;

            if (token) {
                // @ts-ignore
                cookieStore.set("auth-token", token, {
                    httpOnly: true,
                    path: "/",
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 60 * 60,
                });
            }

            return NextResponse.json({
                login: true,
                message: "Login success",
                token,
                user,
            });
        }
    } catch (e: any) {
        if (e.response.status === 401 || e.response.status === 400){
            return NextResponse.json({ login: false, message: "Email atau pasword salah! Silahkan coba lagi!" });
        } else {
            return NextResponse.json({ login: false, message: e });
        }
    }
}