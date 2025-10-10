import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-xl">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-8">
          Halaman yang Anda cari tidak ditemukan.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-md bg-black text-white hover:opacity-90 transition"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-md border border-gray-300 hover:bg-gray-50 transition"
          >
            Hubungi Kami
          </Link>
        </div>
      </div>
    </main>
  );
}


