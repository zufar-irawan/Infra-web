"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import {
  Bolt,
  BookMarked,
  BarChart3,
  LayoutDashboard,
  Users,
  LogOut,
  Shapes,
  X,
  Calendar,
  Clipboard,
  IdCard,
  Smartphone,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  student?: any;
}

export default function Sidebar({ isOpen, onClose, user }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  /** === Logout Handler === **/
  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/logout");
      if (res.status === 200 && res.data.logout) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: res.data.error
            ? `${res.data.error} - Namun Anda tetap berhasil logout`
            : "Anda telah logout!",
          timer: 2000,
          showConfirmButton: false,
        });
        router.push("/edu/login");
      } else {
        throw new Error("Logout response tidak valid");
      }
    } catch (error) {
      console.error("Logout error:", error);
      Swal.fire({
        icon: "warning",
        title: "Logout Paksa",
        text: "Terjadi error saat logout, namun Anda tetap akan di-logout dari sistem",
        timer: 2000,
        showConfirmButton: false,
      });
      router.push("/edu/login");
    }
  };

  /** === Menu Item Generator === **/
  const MenuItem = ({
    href,
    icon: Icon,
    label,
  }: {
    href: string;
    icon: any;
    label: string;
  }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        prefetch
        className={
          isActive
            ? "group bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            : "group rounded-xl px-4 py-3.5 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50/50 transition-all duration-300 cursor-pointer flex items-center gap-3 hover:shadow-sm hover:scale-[1.02] border border-transparent hover:border-orange-100"
        }
      >
        <div
          className={
            isActive
              ? "p-1.5 bg-white/20 rounded-lg"
              : "p-1.5 rounded-lg group-hover:bg-orange-100 transition-colors"
          }
        >
          <Icon
            className={
              isActive
                ? "w-5 h-5"
                : "w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors"
            }
          />
        </div>
        <span
          className={
            isActive
              ? "font-semibold"
              : "font-medium text-gray-700 group-hover:text-orange-700 transition-colors"
          }
        >
          {label}
        </span>
      </Link>
    );
  };

  /** === Role-based Menu === **/
  const adminMenu = [
    { href: "/edu/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/edu/siswa", icon: Users, label: "Siswa" },
    { href: "/edu/kelas", icon: Shapes, label: "Kelas" },
    { href: "/edu/tugas", icon: BookMarked, label: "Tugas" },
    { href: "/edu/ujian", icon: BookMarked, label: "Ujian" },
    { href: "/edu/nilai", icon: BarChart3, label: "Nilai" },
    { href: "/edu/jadwal", icon: Calendar, label: "Jadwal" },
    { href: "/edu/laporan", icon: Clipboard, label: "Laporan" },
  ];

  const presensiMenu = [
    { href: "/edu/setelan", icon: Bolt, label: "Setelan" },
    { href: "/edu/perangkat", icon: Smartphone, label: "Perangkat" },
    { href: "/edu/rfid", icon: IdCard, label: "RFID" },
  ];

  const guruMenu = [
    { href: "/edu/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/edu/tugas", icon: BookMarked, label: "Tugas" },
    { href: "/edu/ujian", icon: BookMarked, label: "Ujian" },
    { href: "/edu/nilai", icon: BarChart3, label: "Nilai" },
    { href: "/edu/jadwal", icon: Calendar, label: "Jadwal" },
    { href: "/edu/laporan", icon: Clipboard, label: "Laporan" },
  ];

  const siswaMenu = [
    { href: "/edu/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/edu/tugas", icon: BookMarked, label: "Tugas" },
    { href: "/edu/ujian", icon: BookMarked, label: "Ujian" },
    { href: "/edu/nilai", icon: BarChart3, label: "Nilai" },
    { href: "/edu/jadwal", icon: Calendar, label: "Jadwal" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/25 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-full fixed lg:relative max-w-xs min-h-screen bg-gradient-to-b from-slate-50 to-white text-gray-700
          border-r border-gray-200 shadow-sm flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div>
          {/* === Header === */}
          <section className="w-full bg-gradient-to-br from-orange-600 via-orange-500 to-orange-600 flex justify-between items-center gap-3 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-sm shadow-lg">
                <Image
                  src="/smk.png"
                  alt="logo-smk"
                  width={50}
                  height={50}
                  className="drop-shadow-md"
                />
              </div>
              <h1 className="text-2xl tracking-tight font-bold text-white drop-shadow-md">
                Presma EDU
              </h1>
            </div>
            <button
              onClick={onClose}
              className="relative z-10 lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </section>

          {/* === User Card === */}
          <section className="w-full p-5">
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex gap-3 items-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-xl flex items-center justify-center shadow-lg ring-4 ring-orange-100">
                  {user?.name
                    ?.split(" ")
                    .map((n: string[]) => n[0]?.toUpperCase())
                    .join("") || "..."}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <h2 className="font-bold text-gray-800 truncate">
                    {user?.name || "Loading..."}
                  </h2>
                  <p className="text-sm text-gray-500 flex items-center gap-1 overflow-hidden">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    {user?.email
                      ? user.email.length > 21
                        ? user.email.slice(0, 21) + "..."
                        : user.email
                      : "Loading..."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* === Menu Sections === */}
          {user?.role === "admin" && (
            <section className="w-full px-5 pb-5">
              <p className="text-gray-400 text-sm my-2">PRESMA EDU</p>
              <nav className="flex flex-col gap-1.5">
                {adminMenu.map((m) => (
                  <MenuItem key={m.href} {...m} />
                ))}
              </nav>
              <p className="text-gray-400 text-sm my-2">PRESENSI</p>
              <nav className="flex flex-col gap-1.5">
                {presensiMenu.map((m) => (
                  <MenuItem key={m.href} {...m} />
                ))}
              </nav>
            </section>
          )}

          {user?.role === "guru" && (
            <section className="w-full px-5 pb-5">
              <nav className="flex flex-col gap-1.5">
                {guruMenu.map((m) => (
                  <MenuItem key={m.href} {...m} />
                ))}
              </nav>
            </section>
          )}

          {user?.role === "siswa" && (
            <section className="w-full px-5 pb-5">
              <nav className="flex flex-col gap-1.5">
                {siswaMenu.map((m) => (
                  <MenuItem key={m.href} {...m} />
                ))}
              </nav>
            </section>
          )}
        </div>

        {/* === Logout Button === */}
        <div className="border-t border-gray-200 bg-gradient-to-b from-white to-slate-50">
          <button
            onClick={handleLogout}
            className="group w-full flex items-center gap-3 p-5 hover:bg-red-50 transition-all duration-300 cursor-pointer bg-transparent border-none text-left"
            type="button"
          >
            <div className="p-1.5 rounded-lg group-hover:bg-red-100 transition-colors">
              <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
            </div>
            <span className="font-medium text-gray-700 group-hover:text-red-700 transition-colors">
              Keluar
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
