"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import DashHeader from "@/app/components/DashHeader";
import { useEduData } from "@/app/edu/context";
import api from "../../lib/api";
import Swal from "sweetalert2";
import { Loader2, Plus, RotateCw } from "lucide-react";

type DeviceRecord = {
  id: string;
  name: string;
  mode: "reader" | "add_card" | string;
  is_active: boolean;
  created_at?: string;
};

const getToken = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("token");
};

export default function DevicePage() {
  const { user, student } = useEduData();
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [changingModeId, setChangingModeId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newDevice, setNewDevice] = useState<{ id: string; name: string; mode: "reader" | "add_card" }>({
    id: "",
    name: "",
    mode: "reader",
  });

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const fetchDevices = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/lms/devices", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = Array.isArray(res.data?.data) ? res.data?.data : [];
        setDevices(
          list.map((item: any) => ({
            id: String(item.id ?? ""),
            name: item.name ?? `Perangkat ${item.id ?? ""}`,
            mode: (item.mode ?? "reader") as DeviceRecord["mode"],
            is_active: Boolean(item.is_active),
            created_at: item.created_at,
          }))
        );
      } catch (error: any) {
        console.error("Gagal mengambil perangkat", error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: error?.response?.data?.message ?? "Tidak dapat memuat data perangkat.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [isAdmin]);

  const filteredDevices = useMemo(() => {
    if (!search.trim()) return devices;
    const query = search.toLowerCase();
    return devices.filter((device) =>
      device.name.toLowerCase().includes(query) ||
      (device.mode ?? "").toLowerCase().includes(query) ||
      device.id.toLowerCase().includes(query)
    );
  }, [devices, search]);

  const mutateDevice = (id: string, updater: (prev: DeviceRecord) => DeviceRecord) => {
    setDevices((prev) => prev.map((device) => (device.id === id ? updater(device) : device)));
  };

  const handleToggleActive = async (device: DeviceRecord) => {
    const token = getToken();
    if (!token) {
      Swal.fire({ icon: "warning", title: "Token tidak ditemukan" });
      return;
    }

    setTogglingId(device.id);
    try {
      const res = await api.patch(`/lms/devices/${device.id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = res.data?.data ?? null;
      if (updated) {
        mutateDevice(device.id, () => ({ ...device, is_active: Boolean(updated.is_active) }));
      } else {
        mutateDevice(device.id, (prev) => ({ ...prev, is_active: !Boolean(prev.is_active) }));
      }
    } catch (error: any) {
      console.error("Gagal mengubah status perangkat", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error?.response?.data?.message ?? "Tidak dapat mengubah status perangkat.",
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleToggleMode = async (device: DeviceRecord) => {
    const token = getToken();
    if (!token) {
      Swal.fire({ icon: "warning", title: "Token tidak ditemukan" });
      return;
    }

    const nextMode = device.mode === "reader" ? "add_card" : "reader";
    setChangingModeId(device.id);
    try {
      const res = await api.patch(
        `/lms/devices/${device.id}/mode`,
        { mode: nextMode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = res.data?.data ?? null;
      if (updated) {
  mutateDevice(device.id, () => ({ ...device, mode: updated.mode }));
      } else {
        mutateDevice(device.id, () => ({ ...device, mode: nextMode }));
      }
    } catch (error: any) {
      console.error("Gagal mengubah mode perangkat", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error?.response?.data?.message ?? "Tidak dapat mengubah mode perangkat.",
      });
    } finally {
      setChangingModeId(null);
    }
  };

  const openCreateModal = () => {
    setNewDevice({ id: "", name: "", mode: "reader" });
    setCreateModalOpen(true);
  };

  const handleCreateDevice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = getToken();
    if (!token) {
      Swal.fire({ icon: "warning", title: "Token tidak ditemukan" });
      return;
    }

    if (!newDevice.id.trim() || !newDevice.name.trim()) {
      Swal.fire({ icon: "warning", title: "Lengkapi data perangkat" });
      return;
    }

    setCreating(true);
    try {
      const res = await api.post(
        "/lms/devices",
        {
          id: newDevice.id.trim(),
          name: newDevice.name.trim(),
          mode: newDevice.mode,
          is_active: 1,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const created = res.data?.data ?? null;
      if (created) {
        setDevices((prev) => [
          {
            id: String(created.id ?? newDevice.id),
            name: created.name ?? newDevice.name,
            mode: (created.mode ?? newDevice.mode) as DeviceRecord["mode"],
            is_active: Boolean(created.is_active ?? 1),
            created_at: created.created_at ?? new Date().toISOString(),
          },
          ...prev,
        ]);
      }
      Swal.fire({ icon: "success", title: "Berhasil", text: "Perangkat baru berhasil dibuat." });
      setCreateModalOpen(false);
      setNewDevice({ id: "", name: "", mode: "reader" });
    } catch (error: any) {
      console.error("Gagal membuat perangkat", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error?.response?.data?.message ?? "Tidak dapat membuat perangkat baru.",
      });
    } finally {
      setCreating(false);
    }
  };

  const renderCreateModal = () => {
    if (!createModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">Tambah Perangkat</h2>
            <button
              onClick={() => setCreateModalOpen(false)}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
              aria-label="Tutup"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleCreateDevice} className="grid gap-4 px-6 py-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">ID Perangkat</label>
              <input
                value={newDevice.id}
                onChange={(e) => setNewDevice((prev) => ({ ...prev, id: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                placeholder="Masukkan ID unik perangkat"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">Nama Perangkat</label>
              <input
                value={newDevice.name}
                onChange={(e) => setNewDevice((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                placeholder="Contoh: Gerbang Depan"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">Mode Awal</label>
              <select
                value={newDevice.mode}
                onChange={(e) => setNewDevice((prev) => ({ ...prev, mode: e.target.value as "reader" | "add_card" }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                <option value="reader">Reader</option>
                <option value="add_card">Add Card</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600 disabled:opacity-70"
              >
                {creating && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (!isAdmin) {
    return (
      <div className="overflow-y-auto min-h-screen bg-gray-50">
        <DashHeader user={user} student={student} />
        <div className="p-6">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-700">
            Hanya admin yang dapat mengakses manajemen perangkat.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto min-h-screen bg-gray-50">
      <DashHeader user={user} student={student} />

      <section className="p-6 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Manajemen Perangkat IoT</h1>
            <p className="text-sm text-gray-500">Kelola perangkat reader dan mode registrasi kartu.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Cari nama atau ID perangkat..."
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z" />
              </svg>
            </div>
            {/*<button*/}
            {/*  onClick={openCreateModal}*/}
            {/*  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600"*/}
            {/*>*/}
            {/*  <Plus className="h-4 w-4" /> Tambah*/}
            {/*</button>*/}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-orange-400 text-sm font-semibold uppercase tracking-wide text-white">
                <tr>
                  <th className="px-6 py-3 text-left">No</th>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Nama</th>
                  <th className="px-6 py-3 text-left">Mode</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Aktif sejak</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      <div className="inline-flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-2 text-sm text-orange-600">
                        <Loader2 className="h-4 w-4 animate-spin" /> Memuat perangkat...
                      </div>
                    </td>
                  </tr>
                ) : filteredDevices.length > 0 ? (
                  filteredDevices.map((device, index) => {
                    const isActive = Boolean(device.is_active);
                    return (
                      <tr key={device.id} className="border-t hover:bg-orange-50/40 transition">
                        <td className="px-6 py-3 font-medium text-gray-700">{index + 1}</td>
                        <td className="px-6 py-3 font-mono text-xs text-gray-500">{device.id}</td>
                        <td className="px-6 py-3 text-sm text-gray-800">{device.name}</td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() => handleToggleMode(device)}
                            disabled={changingModeId === device.id}
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                              device.mode === "reader"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                            } disabled:opacity-60`}
                          >
                            {changingModeId === device.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            {device.mode === "reader" ? "Reader" : "Add Card"}
                          </button>
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {isActive ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500">
                          {device.created_at ? new Date(device.created_at).toLocaleString("id-ID") : "-"}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <button
                            onClick={() => handleToggleActive(device)}
                            disabled={togglingId === device.id}
                            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                              isActive
                                ? "border-rose-200 text-rose-600 hover:bg-rose-50"
                                : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            } disabled:opacity-60`}
                          >
                            {togglingId === device.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <RotateCw className="h-3.5 w-3.5" />
                            )}
                            {isActive ? "Nonaktifkan" : "Aktifkan"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm font-medium text-gray-500">
                      {search ? "Tidak ada perangkat yang sesuai pencarian." : "Belum ada perangkat terdaftar."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {renderCreateModal()}
    </div>
  );
}
