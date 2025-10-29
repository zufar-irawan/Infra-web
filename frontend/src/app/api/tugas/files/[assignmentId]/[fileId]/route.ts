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
    const res = await api.get(
      `/lms/assignments/${encodeURIComponent(assignmentId)}/files/${encodeURIComponent(fileId)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'arraybuffer',
      }
    );

    // Get content type from response
    const contentType = res.headers['content-type'] || 'application/octet-stream';
    const contentDisposition = res.headers['content-disposition'];

    // Convert the arraybuffer properly
    // res.data is already an ArrayBuffer from axios
    const arrayBuffer = res.data instanceof ArrayBuffer ? res.data : res.data.buffer;

    // Create response with the file data
    const response = new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        ...(contentDisposition && { 'Content-Disposition': contentDisposition }),
      },
    });

    return response;
  } catch (error: any) {
    console.error('File download error:', error);
    const status = error?.response?.status ?? 500;
    const data = error?.response?.data ?? { error: "Failed to download file" };
    return NextResponse.json(data, { status });
  }
}
