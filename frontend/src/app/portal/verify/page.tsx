"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import api from "@/app/lib/api";
import Cookies from "js-cookie";
import { Loader2, Lock, ChevronLeft } from "lucide-react";

const MySwal = withReactContent(Swal);

export default function VerifyCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const [email] = useState(emailParam);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handleChange = (val: string, index: number) => {
    if (!/^\d?$/.test(val)) return;
    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);
    if (val && index < 5) document.getElementById(`code-${index + 1}`)?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      MySwal.fire({
        icon: "warning",
        title: "Kode Tidak Lengkap",
        text: "Masukkan 6 digit kode verifikasi.",
        confirmButtonColor: "#FE4D01",
        background: "#1e2b63",
        color: "#fff",
      });
      return;
    }

    setLoading(true);
    try {
      // 🔥 Kirim langsung ke backend Laravel
      const res = await api.post("/auth/verify-code", { email, code: fullCode });

      if (res.data.success && res.data.token) {
        // ✅ Simpan token ke cookie (biar dashboard bisa akses)
        Cookies.set("portal-auth-token", res.data.token, {
          path: "/",
          secure: false, // true nanti kalau HTTPS aktif
          sameSite: "lax",
        });

        // ✅ Tampilkan pesan sukses
        await MySwal.fire({
          icon: "success",
          title: "Verifikasi Berhasil!",
          text: "Selamat datang di Portal Admin.",
          showConfirmButton: false,
          timer: 1300,
          background: "#1e2b63",
          color: "#fff",
        });

        // ✅ Delay sedikit biar cookie sempat terset sebelum redirect
        setTimeout(() => {
          router.replace("/portal/dashboard");
        }, 300);
      } else {
        MySwal.fire({
          icon: "error",
          title: "Verifikasi Gagal!",
          text: res.data.message || "Kode salah atau kadaluarsa.",
          confirmButtonColor: "#FE4D01",
          background: "#1e2b63",
          color: "#fff",
        });
      }
    } catch (error: any) {
      console.error("Verify Error:", error);
      MySwal.fire({
        icon: "error",
        title: "Kesalahan Server",
        text:
          error.response?.data?.message ||
          "Tidak dapat terhubung ke server backend.",
        confirmButtonColor: "#FE4D01",
        background: "#1e2b63",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#243771] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#243771] via-[#1e2b63] to-[#111b45]" />
      <div className="absolute w-[400px] h-[400px] bg-[#FE4D01]/20 rounded-full blur-[120px] -top-20 -left-20" />

      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-[90%] max-w-md text-center shadow-xl">
        <button
          onClick={() => router.push("/portal")}
          className="absolute left-6 top-6 text-white/70 hover:text-white"
        >
          <ChevronLeft size={22} />
        </button>

        <Lock size={46} className="text-[#FE4D01] mb-3 mx-auto" />
        <h1 className="text-2xl font-bold text-white mb-1">Verifikasi Kode</h1>
        <p className="text-white/70 text-sm mb-6">
          Masukkan 6 digit kode yang dikirim ke <br />
          <span className="text-[#FE4D01] font-semibold">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {code.map((num, i) => (
              <input
                key={i}
                id={`code-${i}`}
                type="text"
                maxLength={1}
                value={num}
                onChange={(e) => handleChange(e.target.value, i)}
                className="w-10 h-12 sm:w-12 sm:h-14 rounded-md bg-white/20 text-white text-center text-lg font-semibold focus:ring-2 focus:ring-[#FE4D01] outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-[#FE4D01] to-[#FE7A32] text-white font-semibold hover:scale-[1.02] transition-all disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Verifikasi...
              </>
            ) : (
              "Verifikasi Sekarang"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
