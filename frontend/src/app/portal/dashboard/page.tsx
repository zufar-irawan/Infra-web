"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Loader2, LogOut } from "lucide-react";

const MySwal = withReactContent(Swal);

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<{ name?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Ambil data admin saat halaman dimuat
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = Cookies.get("portal-auth-token");
        if (!token)
          return await autoLogout(
            "Belum Login",
            "Silakan login terlebih dahulu.",
            "warning"
          );

        // 🔥 Gunakan API Laravel langsung (pakai token)
        const [check, dashboard] = await Promise.all([
          api.get("/auth/check-token", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/portal/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // ✅ Token valid
        if (check.data.success && dashboard.data.success) {
          setAdmin({
            name:
              dashboard.data.message?.replace("Selamat datang, ", "") || "Admin",
            email: dashboard.data.email || check.data.email,
          });
        } else {
          await autoLogout(
            "Token Tidak Valid",
            "Silakan login ulang.",
            "warning"
          );
        }
      } catch (err: any) {
        await autoLogout(
          "Sesi Berakhir",
          err.response?.data?.message ||
            "Server tidak merespons atau token tidak valid.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  // 🚪 Logout handler
  const handleLogout = async () => {
    try {
      const token = Cookies.get("portal-auth-token");
      await api.post(
        "/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Cookies.remove("portal-auth-token");
      await MySwal.fire({
        icon: "success",
        title: "Logout Berhasil",
        text: "Anda telah keluar dari Portal Admin.",
        showConfirmButton: false,
        timer: 1500,
      });
      window.location.href = "/portal";
    } catch {
      Cookies.remove("portal-auth-token");
      window.location.href = "/portal";
    }
  };

  // ⛔ Auto logout kalau token tidak valid
  const autoLogout = async (
    title: string,
    message: string,
    icon: "error" | "warning"
  ) => {
    Cookies.remove("portal-auth-token");
    await MySwal.fire({
      icon,
      title,
      text: message,
      confirmButtonColor: "#FE4D01",
    });
    window.location.href = "/portal";
  };

  // 🔄 Loading state
  if (loading)
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f5f7ff] via-[#fffdfb] to-[#fef6f0] text-[#243771]">
        <Loader2 className="animate-spin mb-3" size={32} />
        <p className="font-medium animate-pulse text-[#555]">
          Memuat dashboard...
        </p>
      </main>
    );

  // 🎨 Konten utama dashboard
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f5f7ff] via-[#fffdfb] to-[#fff5f0] px-3 sm:px-6 md:px-10 py-8 sm:py-12">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-md shadow-md border border-gray-100 p-5 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-[#243771] leading-tight">
              🎯 Dashboard Admin
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Selamat datang kembali di Portal Admin
            </p>
          </div>

          <div className="flex justify-center sm:justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-[#FE4D01] to-[#ff7433] text-white px-5 py-2.5 rounded-md font-medium shadow-sm hover:shadow-md active:scale-[0.98] transition text-sm sm:text-base"
            >
              <LogOut size={18} /> Keluar
            </button>
          </div>
        </div>

        {/* Content */}
        <section className="text-center border-t border-gray-200 pt-6">
          <h2 className="text-[1.6rem] sm:text-[1.9rem] font-bold text-[#243771] mb-1 leading-tight">
            Halo,&nbsp;
            <span className="text-[#FE4D01]">{admin?.name || "Admin"}</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base break-all">
            {admin?.email}
          </p>
        </section>

        <div className="mt-10">
          <div className="bg-[#fff8f4] border border-[#ffd6ba] rounded-md shadow-inner px-5 py-5 sm:px-8 sm:py-6 max-w-2xl mx-auto text-center">
            <p className="text-gray-800 font-medium text-lg mb-1">
              🎉 Portal siap digunakan!
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Anda bisa menambahkan atau mengatur konten admin dari menu sebelah kiri.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm border-t border-gray-200 pt-6 mt-10">
          © {new Date().getFullYear()} Portal Admin — SMK Prestasi Prima
        </div>
      </div>
    </main>
  );
}
