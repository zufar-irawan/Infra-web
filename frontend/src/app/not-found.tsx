import React from 'react';

export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <div className="text-center max-w-6xl">
        {/* === 404 Section === */}
        <div className="relative mb-8">
          <div className="relative flex items-center justify-center">
            {/* Angka 4 kiri */}
            <span
              className="text-[220px] md:text-[380px] font-extrabold text-blue-900 leading-none select-none relative z-10"
              style={{ marginRight: '-35px' }} // negatif agar menempel logo
            >
              4
            </span>

            {/* Logo tengah (lebih besar, tumpang tindih angka) */}
            <div className="relative z-20 w-[230px] h-[230px] md:w-[340px] md:h-[340px]">
              <img
                src="/smk.png"
                alt="SMK Prestasi Prima Logo"
                className="w-full h-full object-contain relative z-20 drop-shadow-[0_10px_25px_rgba(0,0,0,0.15)]"
                style={{
                  filter: "drop-shadow(0px 12px 35px rgba(0, 0, 0, 0.25)) drop-shadow(0px 0px 20px rgba(255,255,255,0.2))",
                }}
              />

              {/* Efek overlap: border putih lembut supaya nyatu halus */}
              <div className="absolute inset-0 rounded-full border-[12px] border-white opacity-70"></div>
            </div>

            {/* Angka 4 kanan */}
            <span
              className="text-[220px] md:text-[380px] font-extrabold text-blue-900 leading-none select-none relative z-10"
              style={{ marginLeft: '-60px' }}
            >
              4
            </span>
          </div>
        </div>

        {/* === Pesan Error === */}
        <h1 className="text-4xl md:text-5xl font-bold text-orange-500 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-lg md:text-2xl text-blue-900 font-medium">
          Don’t worry, sometimes it happens even to the best of us.
        </p>

        {/* Tombol Kembali */}
        <div className="mt-10">
          <a
            href="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md transition-transform hover:scale-[1.05]"
          >
            Kembali ke Beranda
          </a>
        </div>
      </div>
    </div>
  );
}
