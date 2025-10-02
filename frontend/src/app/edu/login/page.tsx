"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // router untuk redirect
import { ChevronDown } from "lucide-react";

export default function LoginRegisterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("masuk");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    peran: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await axios.post(
        `http://localhost:8000/api/lms/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccessMsg("Login berhasil!");
        console.log("Login response:", response.data);

        // simpan token & user ke localStorage
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));

        const role = response.data.data.user.role || response.data.data.user.peran;

        // Redirect sesuai role
        if (role === "admin") {
          router.push("/edu/admin");
        } else if (role === "teacher") {
          router.push("/edu/teacher");
        } else {
          // default user
          router.push("/edu/student");
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Terjadi kesalahan. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-sm">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-900 rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
            <img src="../smk.png" alt="Logo" />
          </div>
          <h1 className="text-2xl font-black text-orange-500 mb-2">Presma EDU</h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex mb-6 bg-gray-100 rounded-full p-1">
            <button
                onClick={() => setActiveTab('masuk')}
                className={`flex-1 py-2.5 px-4 rounded-full font-semibold transition-all cursor-pointer ${activeTab === 'masuk'
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                    }`}
            >
              Masuk
            </button>
            <button
                onClick={() => setActiveTab('daftar')}
                className={`flex-1 py-2.5 px-4 rounded-full font-semibold transition-all cursor-pointer ${activeTab === 'daftar'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                    }`}
            >
              Daftar
            </button>
            </div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Selamat Datang!
            </h2>
            <p className="text-gray-500">
              {activeTab === "masuk"
                ? "Silahkan login menggunakan akun anda."
                : "Silahkan daftar untuk membuat akun anda."}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="nama@example.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Masukkan password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Pesan error / success */}
          {/* {errorMsg && (
            <p className="mt-4 text-red-500 font-semibold">{errorMsg}</p>
          )}
          {successMsg && (
            <p className="mt-4 text-green-600 font-semibold">
              {successMsg}
            </p>
          )} */}

          <div>
            
          </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all cursor-pointer transform hover:-translate-y-0.5 ${
                activeTab === "masuk"
                  ? "bg-blue-900 hover:bg-blue-800"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {loading
                ? "Memproses..."
                : activeTab === "masuk"
                ? "Masuk"
                : "Daftar"}
            </button>
          </form>

          

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">atau</span>
            </div>
          </div>

          {/* Google login */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full py-3 px-4 bg-white border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Lanjutkan dengan Google
          </button>
        </div>
      </div>
    </div>
  );
}
