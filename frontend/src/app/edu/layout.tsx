// noinspection TypeScriptUMDGlobal,JSIgnoredPromiseFromCall

"use client"

import React from "react";
import {usePathname} from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function EduLayout(
    {children}: {children?: React.ReactNode}
) {
    const pathname = usePathname()

    const isLogin = pathname.includes("/login")

    return (
        <div className="flex flex-row">
            { !isLogin && <Sidebar />}

            <div className={`flex-col ${isLogin && "w-full justify-center"}`}>
                {children}
            </div>
        </div>
    )
}