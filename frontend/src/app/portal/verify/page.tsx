"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { Loader2, Lock, ChevronLeft } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function VerifyCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromParam);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handleChange = (val: string, index: number) => {
    if (!/^\d?$/.test(val)) return;
    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);
    if (val && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      Swal.fire("Kode Tidak Lengkap", "Masukkan 6 digit kode verifikasi.", "warning");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        Swal.fire("Gagal", data.message || "Verifikasi gagal.", "error");
      } else {
        Swal.fire({
          title: "Berhasil!",
          text: "Kode verifikasi benar. Anda akan diarahkan ke dashboard.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
        sessionStorage.setItem("token", data.token);
        router.push("/portal/dashboard");
      }
    } catch (err: any) {
      Swal.fire("Kesalahan", err.message || "Tidak dapat terhubung ke server.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#243771] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#243771] via-[#1e2b63] to-[#111b45]"></div>
      <div className="absolute w-[400px] h-[400px] bg-[#FE4D01]/20 rounded-full blur-[120px] -top-20 -left-20"></div>
      <div className="absolute w-[300px] h-[300px] bg-[#FE4D01]/10 rounded-full blur-[100px] bottom-0 right-0"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 w-[90%] max-w-md text-center">
        <button
          onClick={() => router.push("/portal")}
          className="absolute left-6 top-6 text-white/70 hover:text-white transition"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="flex flex-col items-center mb-8">
          <Lock size={46} className="text-[#FE4D01] mb-3" />
          <h1 className="text-2xl font-bold text-white mb-1">Verifikasi Kode</h1>
          <p className="text-white/70 text-sm max-w-xs">
            Masukkan 6 digit kode yang dikirim ke <br />
            <span className="text-[#FE4D01] font-semibold">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3 sm:gap-4">
            {code.map((num, i) => (
              <input
                key={i}
                id={`code-${i}`}
                type="text"
                maxLength={1}
                value={num}
                onChange={(e) => handleChange(e.target.value, i)}
                className="w-10 h-12 sm:w-12 sm:h-14 rounded-md bg-white/20 text-white text-center text-lg sm:text-2xl font-semibold focus:ring-2 focus:ring-[#FE4D01] outline-none transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-[#FE4D01] to-[#FE7A32] text-white font-semibold hover:scale-[1.02] hover:shadow-lg transition-all duration-200 disabled:opacity-60"
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
