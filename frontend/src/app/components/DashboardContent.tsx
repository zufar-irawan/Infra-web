"use client";

import { AdminDashboard } from "./AdminDashboard";
import { TeacherDashboard } from "./TeacherDashboard";
import { StudentDashboard } from "./StudentDashboard";

interface User {
  name: string;
  role: "admin" | "guru" | "user";
}

export default function DashboardContent({ user }: { user: User }) {
  switch (user.role) {
    case "admin":
      return (
        <div className="flex-1 p-6">
          <AdminDashboard />
        </div>
      );

    case "guru":
      return (
        <div className="flex-1 p-6">
          <TeacherDashboard />
        </div>
      );

    case "user":
      return (
        <div className="flex-1 p-6">
          <StudentDashboard />
        </div>
      );

    default:
      return (
        <div className="flex-1 p-6">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p>Halo {user.name}, role "{user.role}" belum memiliki dashboard khusus.</p>
        </div>
      );
  }
}
