import React from "react";

export default function EduLayout(
    {children}:{children: React.ReactNode}
) {
    return (
        <div className="min-h-screen">
            {children}
        </div>
    )
}