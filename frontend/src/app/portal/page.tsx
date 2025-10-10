"use client";

import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function SecureLoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      MySwal.fire({
        icon: "warning",
        title: "Email belum diisi!",
        text: "Masukkan alamat email terdaftar sebelum melanjutkan.",
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
        title: "Kode Verifikasi Dikirim!",
        html: `<p class="text-sm text-gray-200">Kami telah mengirimkan kode 6 digit ke <b>${email}</b>.</p>`,
        confirmButtonText: "Verifikasi Sekarang",
        confirmButtonColor: "#FE4D01",
        background: "#1e2b63",
        color: "#fff",
      }).then(() => {
        sessionStorage.setItem("verifyEmail", email);
        router.push("/portal/verify");
      });
    }, 1200);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#243771] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#243771] via-[#1e2b63] to-[#111b45]" />
      <div className="absolute w-[400px] h-[400px] bg-[#FE4D01]/20 rounded-full blur-[120px] -top-20 -left-20" />
      <div className="absolute w-[300px] h-[300px] bg-[#FE4D01]/10 rounded-full blur-[100px] bottom-0 right-0" />

      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 w-[90%] max-w-md shadow-[0_8px_30px_rgba(0,0,0,0.4)] animate-fadeIn">
        <div className="text-center mb-8">
          <img
            src="/webp/smk.webp"
            alt="SMK Prestasi Prima"
            className="w-20 h-20 mx-auto mb-4 drop-shadow-lg"
          />
          <h1 className="text-2xl font-bold text-white mb-1">
            Login Administrator
          </h1>
          <p className="text-white/70 text-sm">
            Masukkan email terdaftar untuk menerima kode verifikasi.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white/90 mb-1"
            >
              Alamat Email
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60"
              />
              <input
                type="email"
                id="email"
                placeholder="contoh@smkpp.sch.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/20 text-white placeholder-white/50
                focus:outline-none focus:ring-2 focus:ring-[#FE4D01] transition-all"
              />
            </div>
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
                <Loader2 size={18} className="animate-spin" /> Mengirim...
              </>
            ) : (
              "Kirim Kode Verifikasi"
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
