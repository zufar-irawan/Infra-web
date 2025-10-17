export default function GuruCard({ tugas }: any) {
  // Hitung jumlah siswa yang sudah mengumpulkan berdasarkan submissions
  const submittedCount: number = Array.isArray(tugas?.submissions)
    ? new Set(
        tugas.submissions
          ?.map((s: any) => s?.student_id ?? s?.student?.id ?? s?.user_id ?? s?.user?.id)
          ?.filter((id: any) => id != null)
      ).size
    : 0;

  // Perkirakan total siswa di kelas tugas ini (jika tersedia di data)
  const totalStudents: number =
    tugas?.class?.students?.length ??
    tugas?.students_count ??
    tugas?.class_students_count ??
    tugas?.total_students ??
    0;

  const notSubmittedCount = totalStudents > 0 ? Math.max(totalStudents - submittedCount, 0) : null;

  return (
    <div className="py-3">
      <h3 className="text-base font-semibold">{tugas.title}</h3>
      <p className="text-sm text-gray-500">Kelas: {tugas.class?.name || "Tanpa Kelas"}</p>
      <p className="text-xs text-gray-400">Deadline: {tugas.deadline || "-"}</p>

      {/* Statistik pengumpulan tugas */}
      <div className="mt-2 flex items-center gap-4 text-sm">
        <span className="inline-flex items-center gap-1 text-green-600">
          {/* ikon centang */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-2.59a.75.75 0 1 0-1.22-.87l-3.496 4.893-1.74-1.74a.75.75 0 1 0-1.06 1.061l2.25 2.25a.75.75 0 0 0 1.144-.09l4.182-5.504Z" clipRule="evenodd" />
          </svg>
          Mengumpulkan: <span className="font-semibold">{submittedCount}</span>
        </span>
        <span className="inline-flex items-center gap-1 text-red-600">
          {/* ikon silang */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.47 5.78a.75.75 0 1 0-1.06 1.06L10.94 12l-2.47 2.47a.75.75 0 1 0 1.06 1.06L12 13.06l2.47 2.47a.75.75 0 1 0 1.06-1.06L13.06 12l2.47-2.47a.75.75 0 0 0-1.06-1.06L12 10.94 9.53 8.03Z" clipRule="evenodd" />
          </svg>
          Belum: <span className="font-semibold">{notSubmittedCount ?? "-"}</span>
        </span>
        {totalStudents > 0 && (
          <span className="text-gray-500">/ Total: {totalStudents}</span>
        )}
      </div>
    </div>
  );
}