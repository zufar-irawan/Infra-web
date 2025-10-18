import { cookies } from "next/headers";
import ClientLayout from "./ClientLayout";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ambil token dari cookies (langsung dari server)
  const cookieStore = cookies();
  const token = cookieStore.get("portal-auth-token")?.value || null;

  return <ClientLayout token={token}>{children}</ClientLayout>;
}
