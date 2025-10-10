import {format, parseISO} from "date-fns";
import {id} from "date-fns/locale";

export default function UjianCard(
    {ujian} : {ujian: any}
) {
    const date = ujian.date
    const formattedDate = format(parseISO(date), 'dd MMMM yyyy', { locale: id });

    return (
        <div className="divide-y divide-black/10">
            <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                    <div>
                        <h3>{ujian.title}</h3>
                        <p className="text-black/60 text-sm">{ujian.subject.name} &middot; {ujian.creator.name}</p>
                    </div>
                    <p className="text-xs text-orange-700">Tenggat {formattedDate.toString()}</p>
                </div>
            </div>
        </div>
    )
}