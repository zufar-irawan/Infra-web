import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { LangProvider } from "./components/LangContext";
import ChatWidget from "./components/Chatbot/Chatwidget";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SMK Prestasi Prima",
  description: "Official Website of SMK Prestasi Prima",
  icons: {
    icon: [
      { url: "/favicon.ico" }, // fallback, bisa tetap logo Next.js dulu
      { url: "/webp/smk.webp", type: "image/webp" } // logo SMK kamu
    ],
  },
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
          <main className="overflow-y-auto">
            {children}
            <ChatWidget />
          </main>
        </LangProvider>
      </body>
    </html>
  );
}
