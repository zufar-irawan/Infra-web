import type { NextApiRequest, NextApiResponse } from "next"
import {setToken} from "@/app/lib/Auth"
import api from "@/app/lib/api"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end()

    const { email, password } = req.body

    try {
        const response = await api.post("/lms/login", { email, password })

        const { token, user } = response.data

        setToken(res, token)

        return res.status(200).json({ user })
    } catch (error: any) {
        return res.status(401).json({ message: `Login gagal ${error.message}` })
    }
}