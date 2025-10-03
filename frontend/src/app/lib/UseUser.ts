"use client"

import {useEffect, useState} from "react";
import api from "@/app/lib/api";

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    roles: "siswa" | "guru" | "admin";
    phone?: string;
    status: "aktif" | "nonaktif";
}

export default function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthenticard, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/lms/auth/me", {
                    withCredentials: true,
                })

                if (response.status === 200 && response.data.user) {
                    setUser(response.data.user);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error: any) {
                console.error(`Gagal mengambil user ${error}`)
                setUser(null);
                setIsAuthenticated(false);

                if (error.response?.status === 401) {
                    if(typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
                        window.location.href = '/edu/login';
                    }
                }
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [])

    return { user, loading, isAuthenticard }
}