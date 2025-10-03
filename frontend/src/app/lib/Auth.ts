import {serialize} from "cookie";
import {NextApiResponse, NextApiRequest} from "next";

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
export function getToken(req: NextApiRequest) {
    const cookie = req.headers.cookie;
    if (!cookie) return null;
    const match = cookie.match(new RegExp(`${TOKEN_NAME}=([^;]+)`));
    return match ? match[1] : null;
}