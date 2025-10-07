"use client"

import {useState} from "react";
import {User} from "@/app/api/me/route";
import axios from "axios";

export const UseUser = async () => {
    const [user, setUser] = useState<User | null>(null);

    try {
        const res = await axios.get("/api/user")

        setUser(res.data.user);
    } catch (error) {
        console.log(error);
    }

    return user
}