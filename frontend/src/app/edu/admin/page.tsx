"use client";

import Dashboard from "../pages/dashboard/page";
import Sidebar from "../pages/sidebar";

export default function Admin() {
    return (
        <div className="w-full min-h-screen flex bg-gray-100">
            <Sidebar />
            <Dashboard />
        </div>
    )
}