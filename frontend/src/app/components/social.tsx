"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SocialBar() {
  const [scrolled, setScrolled] = useState(false);

  // deteksi scroll untuk toggle warna
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-1/2 right-0 transform -translate-y-1/2 z-50">
      <div className="relative w-[68px] h-[231px] flex items-center justify-center">
        {/* Background Putih */}
        <Image
          src="/social-bar-white.png"
          alt="Social Bar White"
          fill
          className={`absolute transition-opacity duration-300 ${
            scrolled ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Background Orange */}
        <Image
          src="/social-bar-orange.png"
          alt="Social Bar Orange"
          fill
          className={`absolute transition-opacity duration-300 filter-fe4d01 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Ikon Sosial Media */}
        <div className="flex flex-col items-center gap-5 relative z-10">
          <a
            href="https://api.whatsapp.com/send/?phone=6285195928886"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={
                scrolled
                  ? "/whatsapp-white.png"
                  : "/whatsapp-orange.png"
              }
              alt="WhatsApp"
              width={32}
              height={32}
              className="social-icon"
            />
          </a>

          <a
            href="https://www.instagram.com/smkprestasiprima"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={
                scrolled
                  ? "/instagram-white.png"
                  : "/instagram-orange.png"
              }
              alt="Instagram"
              width={32}
              height={32}
              className="social-icon"
            />
          </a>

          <a
            href="https://m.youtube.com/@SEKOLAHPRESTASIPRIMA"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={
                scrolled
                  ? "/youtube-white.png"
                  : "/youtube-orange.png"
              }
              alt="YouTube"
              width={32}
              height={32}
              className="social-icon"
            />
          </a>

          <a
            href="https://www.tiktok.com/@smkprestasiprima"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={
                scrolled
                  ? "/tiktok-white.png"
                  : "/tiktok-orange.png"
              }
              alt="TikTok"
              width={32}
              height={32}
              className="social-icon"
            />
          </a>
        </div>
      </div>

      {/* CSS khusus filter warna */}
      <style jsx global>{`
        .filter-fe4d01 {
          filter: brightness(0) saturate(100%) invert(43%) sepia(82%)
            saturate(3800%) hue-rotate(1deg) brightness(101%) contrast(101%);
        }
        .social-icon {
          transition: transform 0.2s ease, filter 0.2s ease;
          cursor: pointer;
        }
        .social-icon:hover {
          transform: scale(1.1);
          filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.25));
        }
        .social-icon:active {
          transform: scale(0.9);
        }
      `}</style>
    </div>
  );
}
