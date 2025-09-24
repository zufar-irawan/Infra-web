import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { LangProvider } from "./components/LangContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SMK Prestasi Prima",
  description: "Website Resmi SMK Prestasi Prima",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${poppins.className} antialiased min-h-screen flex flex-col`}>
        <LangProvider>
          <main className="flex-grow overflow-auto">{children}</main>
        </LangProvider>
      </body>
    </html>
  );
}
