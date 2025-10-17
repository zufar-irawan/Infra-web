"use client";

import { useEffect, useState } from "react";
import DashHeader from "@/app/components/DashHeader";

export default function DevicePage() {
  const [user, setUser] = useState<any>({ role: "admin", name: "Admin Presma" });
  const [devices, setDevices] = useState<any[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // === Data dummy perangkat ===
  useEffect(() => {
    const dummy = [
      {
        id: "cc8b6c8a-3960-47df-a4a3-f0167b01c8df",
        name: "Device_1",
        mode: "reader",
        is_active: 1,
        created_at: "2025-10-16T03:34:32.000000Z",
      },
      {
        id: "eccb4fe6-797f-4905-ab0d-51ff7434cb8b",
        name: "Device 1",
        mode: "add_card",
        is_active: 0,
        created_at: "2025-10-16T07:47:49.000000Z",
      },
      {
        id: "aab9d8c8-1111-47df-b9a9-abcdf01c8dfa",
        name: "Presensi_Lobby",
        mode: "reader",
        is_active: 1,
        created_at: "2025-10-15T10:21:10.000000Z",
      },
    ];
    setDevices(dummy);
    setFilteredDevices(dummy);
  }, []);

  // === Filter pencarian ===
  useEffect(() => {
    if (!devices || devices.length === 0) return;
    let data = devices;

    if (search.trim()) {
      const query = search.toLowerCase();
      data = data.filter(
        (d: any) =>
          d.name.toLowerCase().includes(query) ||
          d.mode.toLowerCase().includes(query)
      );
    }

    setFilteredDevices(data);
  }, [devices, search]);

  // === Toggle status aktif ===
  const toggleStatus = (id: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, is_active: d.is_active ? 0 : 1 } : d
      )
    );
  };

  // === Ubah mode ===
  const toggleMode = (id: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, mode: d.mode === "reader" ? "add_card" : "reader" }
          : d
      )
    );
  };

  return (
    <div className="overflow-y-auto min-h-screen">
      <DashHeader user={user} />

      <section className="p-6">
        {/* === Header Section === */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="relative w-full sm:w-md">
            <input
              type="text"
              placeholder="Cari nama perangkat..."
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white float-end"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-400 absolute right-3 top-2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z"
              />
            </svg>
          </div>
        </div>

        {/* === Table Section === */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className=" bg-orange-400 text-white text-sm font-semibold uppercase">
                <tr>
                  <th className="px-6 py-3">No</th>
                  <th className="px-6 py-3">Nama</th>
                  <th className="px-6 py-3">Mode</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Tanggal Dibuat</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices && filteredDevices.length > 0 ? (
                  filteredDevices.map((d, i) => (
                    <tr
                      key={i}
                      className="border-t hover:bg-orange-50 transition-all duration-200"
                    >
                      <td className="px-6 py-3 font-medium">{i + 1}</td>
                      <td className="px-6 py-3">{d.name}</td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => toggleMode(d.id)}
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            d.mode === "reader"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {d.mode === "reader" ? "Reader" : "Add Card"}
                        </button>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            d.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {d.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        {new Date(d.created_at).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-3 text-right space-x-2">
                        <button
                          onClick={() => toggleStatus(d.id)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                            d.is_active
                              ? "bg-red-100 text-red-600 hover:bg-red-200"
                              : "bg-green-100 text-green-600 hover:bg-green-200"
                          }`}
                        >
                          {d.is_active ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8 text-gray-500 font-medium"
                    >
                      {search
                        ? "Tidak ada perangkat dengan kata kunci tersebut."
                        : "Belum ada data perangkat yang tersedia."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
