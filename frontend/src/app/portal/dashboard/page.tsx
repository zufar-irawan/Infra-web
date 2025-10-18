"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<{ name?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * ===============================
   *  CEK TOKEN & AMBIL DATA DASHBOARD
   * ===============================
   */
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        // 🟢 1. Cek token via route server
        const check = await axios.get("/api/portal/check-token");

        if (!check.data.success) {
          await logoutWithAlert(
            "Sesi Berakhir",
            "Silakan login ulang.",
            "warning"
          );
          return;
        }

        // 🟢 2. Ambil data dashboard
        const res = await axios.get("/api/portal/dashboard");

        if (res.data.success) {
          setAdmin({
            name: res.data.message?.replace("Selamat datang, ", "") || "Admin",
            email: res.data.email || check.data.email,
          });
        } else {
          await logoutWithAlert(
            "Token Tidak Valid",
            res.data.message || "Silakan login ulang.",
            "error"
          );
        }
      } catch (err: any) {
        console.error("Dashboard Error:", err);
        await logoutWithAlert(
          "Koneksi Gagal",
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

  /**
   * ===============================
   *  HANDLE LOGOUT MANUAL
   * ===============================
   */
  const handleLogout = async () => {
    try {
      await fetch("/api/portal/logout", { method: "GET" }); // 🧠 hapus cookie dari server
      await MySwal.fire({
        icon: "success",
        title: "Logout Berhasil",
        text: "Anda telah keluar dari Portal Admin.",
        showConfirmButton: false,
        timer: 1500,
      });
      window.location.href = "/portal";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/portal";
    }
  };

  /**
   * ===============================
   *  FUNGSI LOGOUT OTOMATIS SAAT TOKEN GAGAL
   * ===============================
   */
  const logoutWithAlert = async (
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
    } catch (error) {
      console.error("Auto logout error:", error);
      window.location.href = "/portal";
    }
  };

  /**
   * ===============================
   *  LOADING STATE
   * ===============================
   */
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
        <p className="text-[#243771] font-medium animate-pulse">
          Memuat dashboard...
        </p>
      </main>
    );
  }

  /**
   * ===============================
   *  DASHBOARD VIEW
   * ===============================
   */
  return (
    <main className="min-h-screen bg-[#f9fafb] p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-3xl font-bold text-[#243771] mb-2">
          Dashboard Admin
        </h1>

        <p className="text-gray-600 mb-4">
          Selamat datang kembali,{" "}
          <span className="text-[#FE4D01] font-semibold">
            {admin?.name || "Admin"}
          </span>
          <br />
          <span className="text-gray-400 text-sm">
            {admin?.email || "memuat..."}
          </span>
        </p>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-[#FE4D01] text-white rounded-lg hover:bg-[#e14400] transition"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
