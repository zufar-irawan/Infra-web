"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import DashboardContent from "@/components/DashboardContent";
import axios from "axios";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("./login");
      return;
    }

    axios
      .get("http://localhost:8000/api/lms/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("./login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="flex">
      {user && <Sidebar user={user} activeSection={activeSection} onSectionChange={setActiveSection} />}
      {user && <DashboardContent user={user} />}
    </div>
  );
}
