"use client";

import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const MySwal = withReactContent(Swal);

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const email = typeof window !== "undefined" ? sessionStorage.getItem("verifyEmail") : "";

  // pindah fokus otomatis
  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length < 6) {
      MySwal.fire({
        icon: "warning",
        title: "Kode belum lengkap!",
        text: "Masukkan 6 digit kode verifikasi.",
        confirmButtonColor: "#FE4D01",
        background: "#1e2b63",
        color: "#fff",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      MySwal.fire({
        icon: "success",
        title: "Verifikasi Berhasil!",
        html: `<p class="text-sm text-gray-200">Selamat datang, <b>${email}</b>.</p>`,
        confirmButtonColor: "#FE4D01",
        background: "#1e2b63",
        color: "#fff",
      }).then(() => {
        router.push("/portal/dashboard");
      });
    }, 1000);
  };

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#243771] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#243771] via-[#1e2b63] to-[#111b45]" />
      <div className="absolute w-[400px] h-[400px] bg-[#FE4D01]/20 rounded-full blur-[120px] -top-20 -left-20" />
      <div className="absolute w-[300px] h-[300px] bg-[#FE4D01]/10 rounded-full blur-[100px] bottom-0 right-0" />

      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 w-[90%] max-w-md shadow-[0_8px_30px_rgba(0,0,0,0.4)] animate-fadeIn text-center">
        <img
          src="/webp/smk.webp"
          alt="SMK Prestasi Prima"
          className="w-16 h-16 mx-auto mb-4 drop-shadow-lg"
        />
        <h1 className="text-2xl font-bold text-white mb-2">
          Verifikasi Kode
        </h1>
        <p className="text-white/70 text-sm mb-6">
          Masukkan 6 digit kode yang dikirim ke <br />
          <span className="text-[#FE4D01] font-medium">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2">
            {code.map((num, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                type="text"
                maxLength={1}
                value={num}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold text-white bg-white/20 border border-white/20 rounded-md focus:ring-2 focus:ring-[#FE4D01] outline-none transition"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg 
            bg-gradient-to-r from-[#FE4D01] to-[#FE7A32] text-white font-semibold
            hover:scale-[1.02] hover:shadow-lg transition-all duration-200 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Memverifikasi...
              </>
            ) : (
              "Verifikasi Sekarang"
            )}
          </button>
        </form>

        <p className="text-xs text-center text-white/50 mt-8">
          © {new Date().getFullYear()} SMK Prestasi Prima • Secure Portal
        </p>
      </div>
    </main>
  );
}
