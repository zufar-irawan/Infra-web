"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EduPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/edu/login");
  }, [router]);

  return null;
}
