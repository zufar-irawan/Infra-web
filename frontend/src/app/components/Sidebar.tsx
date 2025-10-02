"use client";

import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  BookOpen,
  Users,
  FileText,
  Calendar,
  Award,
  Settings,
  BarChart3,
  GraduationCap,
  Home,
  LogOut,
  Bell,
} from "lucide-react";

interface User {
  name: string;
  email: string;
  role: "admin" | "guru" | "user";
}

interface SidebarProps {
  user: User;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ user, activeSection, onSectionChange }: SidebarProps) {
  const router = useRouter();

  // 🔹 Fungsi logout langsung pakai axios
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/lms/auth/logout", null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      // Hapus token & user dari localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect ke halaman login
      router.push("/edu/login");
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  };

  const getMenuItems = () => {
    const commonItems = [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "profil", label: "Profil", icon: Settings },
    ];

    switch (user.role) {
      case "user":
        return [
          ...commonItems.slice(0, 1),
          { id: "kelas", label: "Kelas Saya", icon: BookOpen },
          { id: "tugas", label: "Tugas", icon: FileText },
          { id: "ujian", label: "Ujian", icon: Award },
          { id: "nilai", label: "Nilai", icon: BarChart3 },
          { id: "jadwal", label: "Jadwal", icon: Calendar },
          ...commonItems.slice(1),
        ];
      case "guru":
        return [
          ...commonItems.slice(0, 1),
          { id: "kelas", label: "Kelas", icon: Users },
          { id: "mapel", label: "Mata Pelajaran", icon: BookOpen },
          { id: "tugas", label: "Tugas", icon: FileText },
          { id: "ujian", label: "Ujian", icon: Award },
          { id: "penilaian", label: "Penilaian", icon: BarChart3 },
          { id: "jadwal", label: "Jadwal", icon: Calendar },
          ...commonItems.slice(1),
        ];
      case "admin":
        return [
          ...commonItems.slice(0, 1),
          { id: "users", label: "Manajemen User", icon: Users },
          { id: "kelas", label: "Manajemen Kelas", icon: GraduationCap },
          { id: "mapel", label: "Mata Pelajaran", icon: BookOpen },
          { id: "laporan", label: "Laporan", icon: BarChart3 },
          { id: "system", label: "Sistem", icon: Settings },
        ];
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">EduLearn</h1>
            <p className="text-sm text-gray-600">LMS Platform</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-white">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-600 truncate">{user.email}</p>
          </div>
          <Badge
            variant="secondary"
            className={`text-xs ${
              user.role === "admin"
                ? "bg-red-100 text-red-800"
                : user.role === "guru"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {user.role === "admin" ? "Admin" : user.role === "guru" ? "Guru" : "Siswa"}
          </Badge>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Notifications */}
      <div className="px-3 py-4 border-t border-gray-200">
        <Button variant="ghost" className="w-full justify-start gap-3 text-gray-700">
          <Bell className="w-4 h-4" />
          Notifikasi
          <Badge variant="destructive" className="ml-auto text-xs">
            3
          </Badge>
        </Button>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-700 hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </Button>
      </div>
    </div>
  );
}
