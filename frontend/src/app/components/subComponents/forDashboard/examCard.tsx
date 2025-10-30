import React from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export default function ExamCard(
    { exams }: { exams: any }
) {
    const date = exams.date
    const formattedDate = format(parseISO(date), 'dd MMM yyyy', { locale: id });

    return (
        <div className="flex items-start sm:items-center justify-between py-4 gap-2">
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                <div>
                    <h3>{exams.title}</h3>
                    <p className="text-black/60 text-sm">{exams.subject.name} &middot; {exams.creator.name}</p>
                </div>
                <p className="text-xs text-orange-700">Sampai {formattedDate.toString()}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">

                <Link
                    href={`/edu/ujian/${encodeURIComponent(String(exams?.id ?? ""))}`}
                    className="text-sm bg-orange-500 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-orange-400 hover:shadow transition"
                    prefetch={false}
                >
                    Kerjakan
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                    </svg>
                </Link>
            </div>
        </div>
    )
}