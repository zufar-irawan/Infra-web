'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Loading from './Loading';
import LoadingBar from './LoadingBar';
import { useRouter } from 'next/navigation';
import axios from "axios";
import {User} from "@/app/api/me/route";

interface LoadingContextType {
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
}

interface LoadingProviderProps {
    children: ReactNode;
}

export default function LoadingProvider({ children }: LoadingProviderProps) {
    const [user, setUser] = useState<User | null>(null)

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const res = await axios.get("/api/me");
    //             setUser(res.data.user);
    //         } catch (e: any){
    //             console.error(e);
    //             // Jika error 401/403 atau user tidak ditemukan, logout otomatis
    //             if (e.response && (e.response.status === 401 || e.response.status === 403)) {
    //                 handleLogout();
    //             }
    //         }
    //     }
    //     fetchUser();
    // }, [])

    // const handleLogout = () => {
    //     if (typeof window !== 'undefined') {
    //         // Hapus token/cookie autentikasi jika ada
    //         localStorage.removeItem('token'); // jika pakai token di localStorage
    //         sessionStorage.removeItem('token'); // jika pakai sessionStorage
    //         // Jika pakai cookie, bisa tambahkan kode hapus cookie di sini
    //         // document.cookie = 'token=; Max-Age=0; path=/;';
    //         router.push('/edu/login');
    //     }
    // };

    useEffect(() => {
        if (!pathname.startsWith('/edu/') || pathname !== '/edu/login' ) {
            setIsLoading(true);
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [pathname]);

    const setLoading = (loading: boolean) => {
        setIsLoading(loading);
    };


    return (
        <LoadingContext.Provider value={{ isLoading, setLoading }}>
            <LoadingBar isLoading={isLoading} />
            <Loading isLoading={isLoading} />
            {children}
        </LoadingContext.Provider>
    );
}