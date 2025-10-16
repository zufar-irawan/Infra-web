export type UploadAssignmentParams = {
  assignment_id?: string | number;
  assignmet_id?: string | number; // alias spelling supported
  student_id: string | number;
  files: File[]; // must be native File objects (with name)
  grade?: string | number; // default 0
  feedback?: string; // default ""
  submitted_at?: string | Date; // e.g. "2025-09-25 20:00:00" or Date
};

function toTimestampString(input?: string | Date): string {
  if (!input) return "";
  if (typeof input === "string") return input;
  const d = input as Date;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export async function uploadAssignmentSubmission(params: UploadAssignmentParams) {
  const {
    assignment_id,
    assignmet_id,
    student_id,
    files,
    grade = 0,
    feedback = "",
    submitted_at,
  } = params;

  if ((!assignment_id && !assignmet_id) || !student_id) {
    throw new Error("assignment_id/assignmet_id dan student_id wajib diisi");
  }
  if (!files || !files.length) {
    throw new Error("Minimal 1 file harus diunggah");
  }

  const fd = new FormData();
  // Respect alias if provided, otherwise use standard field
  if (assignmet_id !== undefined) fd.append("assignmet_id", String(assignmet_id));
  else fd.append("assignment_id", String(assignment_id));

  fd.append("student_id", String(student_id));
  fd.append("grade", String(grade ?? 0));
  fd.append("feedback", String(feedback ?? ""));

  const ts = toTimestampString(submitted_at);
  if (ts) fd.append("submitted_at", ts);

  for (const f of files) {
    fd.append("files[]", f);
  }

  const res = await fetch("/api/tugas/submit", { method: "POST", body: fd });
  if (!res.ok) {
    const ct = res.headers.get("content-type") || "";
    const payload = ct.includes("application/json") ? await res.json().catch(() => ({})) : await res.text().catch(() => "");

    let message = "Gagal mengunggah tugas";
    let details: string[] = [];
    if (typeof payload === "string") message = payload || message;
    else {
      if (payload?.message) message = payload.message;
      if (payload?.errors && typeof payload.errors === "object") {
        for (const k of Object.keys(payload.errors)) {
          const arr = payload.errors[k];
          if (Array.isArray(arr)) details.push(...arr);
        }
      }
    }
    throw new Error(details.length ? details.join("\n") : message);
  }
  return res.json().catch(() => ({}));
}

