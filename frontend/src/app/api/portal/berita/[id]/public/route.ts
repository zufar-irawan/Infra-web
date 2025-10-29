import {NextResponse} from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Build headers to forward (Authorization, Cookie) from incoming request
        const forwardHeaders: Record<string, string> = {};
        try {
            const auth = req.headers.get("authorization");
            const cookie = req.headers.get("cookie");
            if (auth) forwardHeaders["authorization"] = auth;
            if (cookie) forwardHeaders["cookie"] = cookie;
            // Also forward content-type if present (defensive)
            const ct = req.headers.get("content-type");
            if (ct) forwardHeaders["content-type"] = ct;
        } catch (e) {
            // ignore header read errors
        }

        // 🔒 Ambil data dari Laravel HTTPS, forward auth/cookie when available
        const res = await fetch(`https://api.smkprestasiprima.sch.id/api/news/${id}`, {
            cache: "no-store",
            headers: forwardHeaders,
        });

        if (!res.ok) {
            // Try to read body for better debugging; body may be JSON or text
            let bodyText = "";
            try {
                bodyText = await res.text();
            } catch (e) {
                bodyText = `<failed to read body: ${String(e)}>`;
            }

            console.error(`❌ Gagal ambil detail berita: ${res.status} ${res.statusText} - ${bodyText}`);
            return NextResponse.json(
                {success: false, message: "Data berita tidak ditemukan"},
                {status: res.status}
            );
        }

        const data = await res.json();
        return NextResponse.json(data, {status: 200});
    } catch (err: any) {
        console.error("❌ Proxy detail berita error:", err);
        return NextResponse.json(
            {success: false, message: "Gagal mengambil detail berita"},
            {status: 500}
        );
    }
}