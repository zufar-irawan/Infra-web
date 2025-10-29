import {NextResponse} from "next/server";

/**
 * Proxy route untuk ambil detail berita berdasarkan ID dari API Laravel.
 * Supaya aman HTTPS dan tidak kena CORS.
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const res = await fetch(`https://api.smkprestasiprima.sch.id/api/kegiatan/${id}/public`, {
            cache: "no-store",
        });

        if (!res.ok) {
            return NextResponse.json({success: false, message: "Gagal memuat detail berita"}, {status: res.status});
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error("❌ Gagal fetch detail berita:", err);
        return NextResponse.json({success: false, message: "Server proxy error"}, {status: 500});
    }
}
