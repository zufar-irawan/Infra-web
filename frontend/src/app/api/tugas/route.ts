import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";
import api from "@/app/lib/api";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('secure-auth-token')?.value;

    if (!token) return NextResponse.json({ error: "Token tidak ada!" }, { status: 401 });

    try {
        const res = await api.get("/lms/assignments", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        if(res.status === 200){
            return NextResponse.json(res.data);
        }
        return NextResponse.json({ error: "Gagal mengambil data tugas" }, { status: res.status });
    } catch (error: any) {
        const status = error?.response?.status ?? 500;
        const data = error?.response?.data ?? { error: "Terjadi kesalahan pada server" };
        return NextResponse.json(data, { status });
    }
}

export async function POST(req: NextRequest) {
    const cookieStore = cookies();
    // @ts-ignore
    const token = cookieStore.get('secure-auth-token')?.value;

    if (!token) return NextResponse.json({ error: "Token tidak ada!" }, { status: 401 });

    try {
        const body = await req.json();
        const {
            created_by,
            class_id,
            title,
            description,
            attachments, // not sent to backend here (backend expects actual files in multipart)
            reference_links,
            deadline,
        } = body || {};

        if (!class_id || !title || !created_by) {
            return NextResponse.json({
                error: "Field wajib: class_id, title, created_by",
            }, { status: 422 });
        }

        // Backend expects a date; provide a sensible default if none provided
        const defaultDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        // Normalize links: backend expects an array of links under `links`
        const links: string[] | undefined = reference_links
            ? (Array.isArray(reference_links) ? reference_links : [reference_links])
            : undefined;

        const payload: any = {
            created_by,
            class_id,
            title,
            description: description ?? null,
            deadline: deadline ?? defaultDeadline,
        };

        if (links && links.length > 0) {
            payload.links = links;
        }

        // Note: attachments (files) are not handled here because the backend expects multipart/form-data with actual files under `files[]`.
        // If file uploads are required, implement a separate upload route that sends FormData to the backend and returns stored file metadata.

        const res = await api.post('/lms/assignments', payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return NextResponse.json(res.data, { status: res.status });
    } catch (error: any) {
        const status = error?.response?.status ?? 500;
        const data = error?.response?.data ?? { error: "Gagal membuat tugas" };
        return NextResponse.json(data, { status });
    }
}