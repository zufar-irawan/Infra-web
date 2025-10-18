import { cookies } from "next/headers";
import ClientLayout from "./ClientLayout";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ambil token dari cookies (harus di-await di Next.js 15)
  const cookieStore = await cookies();
  const token = cookieStore.get("portal-auth-token")?.value || null;

  return <ClientLayout token={token}>{children}</ClientLayout>;
}
