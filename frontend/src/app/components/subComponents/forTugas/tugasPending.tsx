import React from "react";
import {format, parseISO} from "date-fns";
import {id} from "date-fns/locale";
import { useRouter } from "next/navigation";

export default function TugasPending(
    {tugas} : {tugas: any}
) {
    const router = useRouter();
    const date = tugas.deadline
    const formattedDate = format(parseISO(date), 'd MMM yyyy', {locale: id});

    const goToDetail = () => {
        const tid = tugas?.id;
        if (tid == null) return;
        router.push(`/edu/tugas/${tid}`);
    };

    return (
        <div
            className="flex items-start sm:items-center justify-between py-4 gap-2 cursor-pointer rounded-lg p-1 -m-1 hover:bg-gray-50"
            onClick={goToDetail}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToDetail(); } }}
        >
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                <div>
                    <h3>{tugas.title}</h3>
                    <p className="text-black/60 text-sm">
                        {tugas.class?.name ?? tugas?.class_name ?? "Kelas"} &middot; {tugas.creator?.name ?? tugas?.teacher?.user?.name ?? "Guru"}
                    </p>
                </div>
                <p className="text-xs text-orange-700">Sampai {formattedDate.toString()}</p>
            </div>
        </div>
    )
}