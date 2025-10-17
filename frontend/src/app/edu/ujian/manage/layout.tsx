"use client";

import { useEduData } from "@/app/edu/context";
import { redirect } from "next/navigation";
import { ReactNode, useMemo } from "react";

export default function ManageExamLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useEduData();

  const isStaff = useMemo(
    () => Boolean(user && ["teacher", "admin"].includes(user.role)),
    [user]
  );

  if (!user) {
    redirect("/edu/login");
  }

  if (!isStaff) {
    redirect("/edu/ujian");
  }

  return <>{children}</>;
}
