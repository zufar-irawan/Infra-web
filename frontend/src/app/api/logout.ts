import {NextApiRequest, NextApiResponse} from "next";
import {getToken, removeToken} from "@/app/lib/Auth";
import api from "@/app/lib/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end()

    try {
        const token = getToken(req)

        if(!token) return res.status(401).json({message:"Tidak ada token"})

        await api.post("/lms/logout", null, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })

        removeToken(res)

        return res.status(200).json({ message:"Logout berhasil" })
    } catch (error: any) {
        return res.status(500).json({message: `Gagal logout ${error.message}`})
    }
}