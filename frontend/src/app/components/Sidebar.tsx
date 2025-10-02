"use client";

interface User {
  name: string;
  email: string;
  role: "admin" | "guru" | "user";
}

interface SidebarProps {
  user: User;
}

const menus = {
  user: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Kelas Saya", href: "/dashboard/kelas" },
    { label: "Tugas", href: "/dashboard/tugas" },
    { label: "Ujian", href: "/dashboard/ujian" },
    { label: "Nilai", href: "/dashboard/nilai" },
    { label: "Jadwal", href: "/dashboard/jadwal" },
    { label: "Profil", href: "/dashboard/profil" },
  ],
  guru: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Kelas", href: "/dashboard/kelas" },
    { label: "Mata Pelajaran", href: "/dashboard/mapel" },
    { label: "Tugas", href: "/dashboard/tugas" },
    { label: "Ujian", href: "/dashboard/ujian" },
    { label: "Penilaian", href: "/dashboard/penilaian" },
    { label: "Jadwal", href: "/dashboard/jadwal" },
    { label: "Profil", href: "/dashboard/profil" },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Manajemen User", href: "/dashboard/users" },
    { label: "Manajemen Kelas", href: "/dashboard/kelas" },
    { label: "Mata Pelajaran", href: "/dashboard/mapel" },
    { label: "Laporan", href: "/dashboard/laporan" },
    { label: "Sistem", href: "/dashboard/system" },
  ],
};

export default function Sidebar({ user }: SidebarProps) {
  const roleMenus = menus[user.role];

  return (
    <aside className="w-64 min-h-screen bg-white text-gray-700 border-r border-gray-200">
      {/* Header */}
      <section className="flex items-center gap-2 p-5">
        <img src="/smk.png" width={40} height={40} alt="logo" />
        <h1 className="text-2xl font-bold">EduLearn</h1>
      </section>

      {/* User Info */}
      <section className="flex flex-col p-5 border-b">
        <h2 className="font-bold">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
        <span className="mt-1 inline-block text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 capitalize">
          {user.role}
        </span>
      </section>

      {/* Menu */}
      <section className="flex flex-col gap-1 p-5">
        {roleMenus.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            className={`rounded-lg px-4 py-3 transition ${
              idx === 0
                ? "bg-orange-600 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {item.label}
          </a>
        ))}
      </section>

      {/* Notifikasi */}
      <div className="flex items-center justify-between p-5 hover:bg-gray-100 cursor-pointer">
        <span>Notifikasi</span>
        <span className="bg-red-600 text-white flex items-center justify-center w-6 h-6 rounded-full text-xs">
          3
        </span>
      </div>

      {/* Keluar */}
      <div className="p-5 hover:bg-gray-100 cursor-pointer">Keluar</div>
    </aside>
  );
}
