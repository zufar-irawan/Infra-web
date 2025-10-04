import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import ChatWidget from "@/components/Chatbot/Chatwidget";
import React from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SMK Prestasi Prima",
  description: "Official Website of SMK Prestasi Prima",
  icons: {
    icon: "/webp/smk.webp"
  },
};

export default function RootLayout({
  children,
}: {
  children:  React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${poppins.className} antialiased`}>
          <main className="overflow-y-auto">
            {children}
            <ChatWidget />
          </main>
      </body>
    </html>
  );
}
