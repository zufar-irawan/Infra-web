// noinspection TypeScriptUMDGlobal,JSIgnoredPromiseFromCall

"use client"

import React, {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function EduLayout(
    {children}: {children?: React.ReactNode}
) {
    const pathname = usePathname()
    const isLogin = pathname.includes("/login")
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        const handleToggleSidebar = () => {
            setSidebarOpen(prev => !prev)
        }

        window.addEventListener('toggleSidebar', handleToggleSidebar)
        
        return () => {
            window.removeEventListener('toggleSidebar', handleToggleSidebar)
        }
    }, [])

    return (
        <div className="flex flex-row min-h-screen bg-gray-100">
            { !isLogin && (
                <Sidebar
                    isOpen={sidebarOpen} 
                    onClose={() => setSidebarOpen(false)} 
                />
            )}

            <div className="flex-col w-full">
                {children}
            </div>
        </div>
    )
}