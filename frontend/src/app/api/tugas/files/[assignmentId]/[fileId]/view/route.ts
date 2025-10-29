import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import api from "@/app/lib/api";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ assignmentId: string; fileId: string }> }
) {
  const { assignmentId, fileId } = await context.params;

  const cookieStore = cookies();
  // @ts-ignore
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!assignmentId || !fileId) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  try {
    const backendResponse = await fetch(
      `https://api.smkprestasiprima.sch.id/api/lms/assignments/${encodeURIComponent(assignmentId)}/files/${encodeURIComponent(fileId)}/view`,
      {
        headers: { Authorization: `Bearer ${token}` },
        method: 'GET',
        cache: 'no-store',
      }
    );

      if (!backendResponse.ok) {
          const errorText = await backendResponse.text();
          return new NextResponse(errorText, { status: backendResponse.status });
      }

      const bodyStream = backendResponse.body;

      const responseHeaders = new Headers();
      responseHeaders.set(
          'Content-Type',
          backendResponse.headers.get('Content-Type') || 'application/octet-stream'
      );
      responseHeaders.set(
          'Content-Disposition',
          backendResponse.headers.get('Content-Disposition') || 'inline' // Ensure it's inline
      );

      // Add your security headers back
      responseHeaders.set('X-Frame-Options', 'SAMEORIGIN');
      responseHeaders.set('Content-Security-Policy', "frame-ancestors 'self'");

      return new NextResponse(bodyStream, {
          status: backendResponse.status,
          headers: responseHeaders,
      });
  } catch (error: any) {
      console.error('File view proxy error:', error);
      return NextResponse.json(
          { error: "Failed to fetch file from backend" },
          { status: 500 }
      );
  }
}

