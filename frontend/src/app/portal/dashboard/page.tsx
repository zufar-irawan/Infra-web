"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://api.smkprestasiprima.sch.id/api";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = Cookies.get("portal-auth-token");

      if (!token) {
        MySwal.fire({
          icon: "warning",
          title: "Belum Login",
          text: "Silakan login terlebih dahulu.",
          confirmButtonColor: "#FE4D01",
        }).then(() => (window.location.href = "/portal"));
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/portal/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setAdmin({
            name: res.data.message.replace("Selamat datang, ", ""),
            email: res.data.email,
          });
        } else {
          MySwal.fire({
            icon: "error",
            title: "Token Tidak Valid",
            text: res.data.message || "Silakan login ulang.",
            confirmButtonColor: "#FE4D01",
          }).then(() => (window.location.href = "/portal"));
        }
      } catch (err: any) {
        MySwal.fire({
          icon: "error",
          title: "Gagal Terhubung ke Server",
          text: err.response?.data?.message || "Server tidak merespons.",
          confirmButtonColor: "#FE4D01",
        });
      }
    };

    fetchAdmin();
  }, []);

  const handleLogout = () => {
    Cookies.remove("portal-auth-token");
    window.location.href = "/portal";
  };

  return (
    <main className="min-h-screen bg-[#f9fafb] p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-3xl font-bold text-[#243771] mb-2">Dashboard Admin</h1>
        <p className="text-gray-600 mb-4">
          Selamat datang kembali,{" "}
          <span className="text-[#FE4D01] font-semibold">{admin?.name || "Admin"}</span>
          <br />
          <span className="text-gray-400 text-sm">{admin?.email || "memuat..."}</span>
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
