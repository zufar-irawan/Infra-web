import {serialize} from "cookie";
import {NextApiResponse, NextApiRequest} from "next";
import {IncomingMessage} from "node:http";

const TOKEN_NAME = "token";

//Simpan token
export function setToken(res: NextApiResponse, token: string) {
    const cookie = serialize(TOKEN_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    res.setHeader("Set-Cookie", cookie);
}

//Hapus token
export function removeToken(res: NextApiResponse) {
    const cookie = serialize(TOKEN_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: -1,
    })

    res.setHeader("Set-Cookie", cookie);
}

//Ambil token
export function getToken(req: NextApiRequest): string | null;
export function getToken(req: IncomingMessage): string | null;
export function getToken(req: any): string | null {
    const cookieHeader = req.headers?.cookie;
    if (!cookieHeader) return null;
    const match = cookieHeader.match(/token=([^;]+)/);
    return match ? match[1] : null;
}