import React from "react";
import {format, parseISO} from "date-fns";
import {id} from "date-fns/locale";

export default function TugasPending(
    {tugas} : {tugas: any}
) {
    const date = tugas.deadline
    const formattedDate = format(parseISO(date), 'd MMM yyyy', {locale: id});

    console.log(tugas)

    return (
        <div className="flex items-start sm:items-center justify-between py-4 gap-2">
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                <div>
                    <h3>{tugas.title}</h3>
                    <p className="text-black/60 text-sm">
                        {tugas.class.name} &middot; {tugas.creator.name}
                    </p>
                </div>
                <p className="text-xs text-orange-700">Sampai {formattedDate.toString()}</p>
            </div>
        </div>
    )
}