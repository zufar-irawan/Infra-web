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
  description: "official Website of SMK Prestasi Prima",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${poppins.className} antialiased`}>
        <LangProvider>
          <main className="overflow-y-auto">{children}</main>
        </LangProvider>
      </body>
    </html>
  );
}
