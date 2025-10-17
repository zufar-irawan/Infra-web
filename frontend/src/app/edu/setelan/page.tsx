"use client";

import DashHeader from "@/app/components/DashHeader";
import { useEduData } from "@/app/edu/context";

export default function Setelan() {
    const mulaiMasukSiswa = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('mulai masuk siswa', e.target.value);
    };
    const batasMasukSiswa = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('batas masuk siswa', e.target.value);
    };
    const mulaiKeluarSiswa = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('mulai keluar siswa', e.target.value);
    };
    const batasKeluarSiswa = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('batas keluar siswa', e.target.value);
    };
    const { user, student } = useEduData();

    return (
        <>
            {user?.role === 'admin' && (
                <div className="overflow-y-auto min-h-screen">
                    <DashHeader user={user} student={student} />

                    <form method="POST" action="#">
                        <section className="w-full p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                                    <h2 className="text-base font-semibold mb-2">Mulai absen masuk siswa</h2>
                                    <input value={'00:00:00'} onChange={mulaiMasukSiswa} type="time" name="mulai_masuk_siswa" id="mulai_masuk_siswa" className="bg-gray-100 text-gray-500 border-1 w-full px-3 py-1 rounded-sm" />
                                </div>
                                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                                    <h2 className="text-base font-semibold mb-2">Batas absen masuk siswa</h2>
                                    <input value={'00:00:00'} onChange={batasMasukSiswa} type="time" name="batas_masuk_siswa" id="batas_masuk_siswa" className="bg-gray-100 text-gray-500 border-1 w-full px-3 py-1 rounded-sm" />
                                </div>
                                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                                    <h2 className="text-base font-semibold mb-2">Mulai absen keluar siswa</h2>
                                    <input value={'00:00:00'} onChange={mulaiKeluarSiswa} type="time" name="mulai_keluar_siswa" id="mulai_keluar_siswa" className="bg-gray-100 text-gray-500 border-1 w-full px-3 py-1 rounded-sm" />
                                </div>
                                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                                    <h2 className="text-base font-semibold mb-2">Batas absen keluar siswa</h2>
                                    <input value={'00:00:00'} onChange={batasKeluarSiswa} type="time" name="batas_keluar_siswa" id="batas_keluar_siswa" className="bg-gray-100 text-gray-500 border-1 w-full px-3 py-1 rounded-sm" />
                                </div>
                        </section>
                    </form>
                </div>
            )}
        </>
    );
}