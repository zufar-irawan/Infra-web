import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import api from "@/app/lib/api";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) return NextResponse.json({ error: "Token tidak ada!" }, { status: 401 });

    try {
        const res = await api.get("/lms/assignments", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        if (res.status === 200) {
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
    try {
        const contentType = req.headers.get("content-type") || "";

        let createdBy = "";
        let classId = "";
        let title = "";
        let description = "";
        let deadline = "";
        let links: string[] = [];
        let files: File[] = [];

        if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
            const incoming = await req.formData();

            const normalize = (primary: string, fallback?: string) =>
                (incoming.get(primary) || (fallback ? incoming.get(fallback) : "") || "").toString();

            createdBy = normalize("created_by", "createdBy");
            classId = normalize("class_id", "classId");
            title = normalize("title");
            description = (incoming.get("description") ?? "").toString();
            deadline = (incoming.get("deadline") ?? "").toString();

            const linkCandidates = [
                incoming.getAll("links[]"),
                incoming.getAll("links"),
                incoming.getAll("reference_links[]"),
                incoming.getAll("reference_links"),
            ];
            links = linkCandidates
                .flat()
                .filter((entry): entry is string => typeof entry === "string")
                .map((link) => link.trim())
                .filter(Boolean);

            const fileCandidates = [
                incoming.getAll("files[]"),
                incoming.getAll("files"),
                incoming.getAll("attachments[]"),
                incoming.getAll("attachments"),
            ];
            files = fileCandidates.flat().filter((f): f is File => f instanceof File);
        } else if (contentType.includes("application/json")) {
            const body: any = await req.json().catch(() => null);

            if (!body || typeof body !== "object") {
                return NextResponse.json({ ok: false, message: "Payload JSON tidak valid" }, { status: 400 });
            }

            const normalize = (value: any) =>
                value === undefined || value === null ? "" : typeof value === "string" ? value : value.toString();

            createdBy = normalize(body.created_by ?? body.createdBy);
            classId = normalize(body.class_id ?? body.classId);
            title = normalize(body.title);
            description = normalize(body.description);
            deadline = normalize(body.deadline);

            const candidateLinks = body.links ?? body.reference_links;
            if (Array.isArray(candidateLinks)) {
                links = candidateLinks
                    .map((link: any) => normalize(link).trim())
                    .filter((link: string) => !!link);
            } else if (candidateLinks) {
                const single = normalize(candidateLinks).trim();
                if (single) links = [single];
            }

            // Files sent via JSON (e.g., base64 strings) are not supported for direct passthrough; expect FormData uploads.
        } else {
            return NextResponse.json(
                { ok: false, message: "Content-Type harus multipart/form-data, application/x-www-form-urlencoded, atau application/json" },
                { status: 415 }
            );
        }

        if (!createdBy || !classId || !title) {
            return NextResponse.json(
                { ok: false, message: "Field wajib: created_by, class_id, title" },
                { status: 422 }
            );
        }

        const out = new FormData();
        out.append("created_by", createdBy);
        out.append("class_id", classId);
        out.append("title", title);
        if (description) out.append("description", description);
        if (deadline) out.append("deadline", deadline);
        links.forEach((link) => {
            out.append("links[]", link);
        });
        files.forEach((file) => {
            out.append("files[]", file);
        });

        // Auth header: prefer incoming Authorization, fallback to cookie token
        const incomingAuth = req.headers.get("authorization");
        const cookieStore = cookies();
        // @ts-ignore
        const cookieToken = cookieStore.get("auth-token")?.value;
        const authHeader = incomingAuth || (cookieToken ? `Bearer ${cookieToken}` : undefined);

        const upstream = await fetch("https://api.smkprestasiprima.sch.id/api/lms/assignments", {
            method: "POST",
            headers: {
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
            body: out,
        });

        const upstreamContentType = upstream.headers.get("content-type") || "";
        const isJson = upstreamContentType.includes("application/json");

        if (!upstream.ok) {
            const payload = isJson ? await upstream.json().catch(() => ({})) : await upstream.text().catch(() => "");
            const errorBody = isJson ? payload : { message: typeof payload === "string" ? payload : "Upstream error" };
            return NextResponse.json({ ok: false, status: upstream.status, ...errorBody }, { status: upstream.status });
        }

        const data = isJson ? await upstream.json().catch(() => ({})) : await upstream.text().catch(() => "");
        return NextResponse.json(typeof data === "string" ? { ok: true, data } : data, { status: upstream.status });
    } catch (err: any) {
        return NextResponse.json(
            { ok: false, message: err?.message || "Terjadi kesalahan saat membuat tugas" },
            { status: 500 }
        );
    }
}