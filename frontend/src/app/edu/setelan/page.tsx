"use client";

import DashHeader from "@/app/components/DashHeader";
import { useEduData } from "@/app/edu/context";

export default function Setelan() {
    const { user, student } = useEduData();

    return (
        <>
            {user?.role === 'admin' && (
                <div className="overflow-y-auto min-h-screen">
                    <DashHeader user={user} student={student} />

                    <div className="w-full p-4 flex flex-col gap-4">
                        {/* // */}
                    </div>
                </div>
            )}
        </>
    );
}