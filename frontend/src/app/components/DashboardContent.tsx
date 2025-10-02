"use client";

interface User {
  name: string;
  role: "admin" | "guru" | "user";
}

export default function DashboardContent({ user }: { user: User }) {
  if (user.role === "user") {
    return (
      <div className="p-6 flex-1">
        <h1 className="text-xl font-bold mb-4">Dashboard Siswa</h1>
        <p>Halo {user.name}, ini konten siswa sesuai progress kelas, tugas, nilai.</p>
        {/* tambahkan card sesuai gambar siswa */}
      </div>
    );
  }

  if (user.role === "guru") {
    return (
      <div className="p-6 flex-1">
        <h1 className="text-xl font-bold mb-4">Dashboard Guru</h1>
        <p>Halo {user.name}, ini overview kelas yang Anda ajar & tugas yang dikumpulkan siswa.</p>
        {/* tambahkan card sesuai gambar guru */}
      </div>
    );
  }

  if (user.role === "admin") {
    return (
      <div className="p-6 flex-1">
        <h1 className="text-xl font-bold mb-4">Dashboard Admin</h1>
        <p>Halo {user.name}, ini statistik pertumbuhan pengguna & performa mata pelajaran.</p>
        {/* tambahkan chart sesuai gambar admin */}
      </div>
    );
  }

  return null;
}
