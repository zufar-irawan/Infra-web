"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Loader2, LogOut } from "lucide-react";

const MySwal = withReactContent(Swal);

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<{ name?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        // 🧠 Jalankan check-token dan dashboard secara paralel
        const [check, res] = await Promise.all([
          axios.get("/api/portal/check-token"),
          axios.get("/api/portal/dashboard"),
        ]);

        if (check.data.success && res.data.success) {
          setAdmin({
            name: res.data.message?.replace("Selamat datang, ", "") || "Admin",
            email: res.data.email || check.data.email,
          });
        } else {
          await autoLogout("Token Tidak Valid", "Silakan login ulang.", "warning");
        }
      } catch (err: any) {
        console.error("Dashboard Error:", err);
        await autoLogout(
          "Sesi Berakhir",
          err.response?.data?.message || "Server tidak merespons atau token tidak valid.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/portal/logout", { method: "GET" });
      await MySwal.fire({
        icon: "success",
        title: "Logout Berhasil",
        text: "Anda telah keluar dari Portal Admin.",
        showConfirmButton: false,
        timer: 1500,
      });
      window.location.href = "/portal";
    } catch {
      window.location.href = "/portal";
    }
  };

  const autoLogout = async (
    title: string,
    message: string,
    icon: "error" | "warning"
  ) => {
    try {
      await fetch("/api/portal/logout", { method: "GET" });
      await MySwal.fire({
        icon,
        title,
        text: message,
        confirmButtonColor: "#FE4D01",
      });
      window.location.href = "/portal";
    } catch {
      window.location.href = "/portal";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#f9fafb] text-[#243771]">
        <Loader2 className="animate-spin mb-3" size={32} />
        <p className="font-medium animate-pulse">Memuat dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f9fafb] p-8 transition-all">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#243771]">Dashboard Admin</h1>
            <p className="text-gray-600">
              Selamat datang,{" "}
              <span className="text-[#FE4D01] font-semibold">{admin?.name || "Admin"}</span>
              <br />
              <span className="text-gray-400 text-sm">{admin?.email}</span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-[#FE4D01] text-white rounded-lg hover:bg-[#e14400] transition"
          >
            <LogOut size={18} /> Keluar
          </button>
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        <section className="text-center text-gray-600">
          <p>🎉 Portal siap digunakan. Tambahkan konten admin di sini.</p>
        </section>
      </div>
    </main>
  );
}
