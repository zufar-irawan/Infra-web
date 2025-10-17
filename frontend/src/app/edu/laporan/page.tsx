"use client";

import React from "react";
import { useEduData } from "@/app/edu/context";

// Small helper to normalize API responses that may wrap arrays in { data: [] }
function toArray(payload: any): any[] {
  if (!payload) return [];
  const data = payload.data ?? payload;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export default function LaporanPage() {
  const { students, classes } = useEduData();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [examResults, setExamResults] = React.useState<any[]>([]);

  // Fetch all exam results once when page loads
  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/exam-results");
        if (!res.ok) {
          const msg = `Gagal mengambil data exam results (${res.status})`;
          if (!cancelled) setError(msg);
          return;
        }
        const json = await res.json();
        if (!cancelled) setExamResults(toArray(json));
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Terjadi kesalahan saat memuat data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  // Build lookup: studentId -> classId
  const studentToClass = React.useMemo(() => {
    const map = new Map<string, string | number | null>();
    (students || []).forEach((s: any) => {
      const sid = s?.id ?? s?.student_id;
      const cid = s?.class_id ?? s?.class?.id ?? null;
      if (sid != null) map.set(String(sid), cid);
    });
    return map;
  }, [students]);

  // Build lookup: classId -> className
  const classIdToName = React.useMemo(() => {
    const map = new Map<string, string>();
    (classes || []).forEach((c: any) => {
      const cid = c?.id ?? c?.class_id;
      const name = c?.name ?? c?.class_name ?? c?.title ?? `Kelas ${cid ?? ''}`;
      if (cid != null) map.set(String(cid), String(name));
    });
    return map;
  }, [classes]);

  // Aggregate per-class average from examResults
  const classStats = React.useMemo(() => {
    // classId -> { total: number, count: number, students: Set<string> }
    const agg = new Map<string, { total: number; count: number; students: Set<string> }>();

    for (const r of examResults) {
      const sid = r?.student_id ?? r?.studentId ?? r?.student?.id;
      if (sid == null) continue;
      const cid = studentToClass.get(String(sid));
      if (cid == null) continue;

      const key = String(cid);
      const scoreRaw = r?.score ?? r?.grade ?? r?.value ?? 0;
      const score = typeof scoreRaw === "number" ? scoreRaw : Number(scoreRaw) || 0;

      const node = agg.get(key) ?? { total: 0, count: 0, students: new Set<string>() };
      node.total += score;
      node.count += 1;
      node.students.add(String(sid));
      agg.set(key, node);
    }

    // Convert to array for rendering, include class name and student count
    const rows = Array.from(agg.entries()).map(([cid, { total, count, students }]) => {
      const avg = count > 0 ? Number((total / count).toFixed(2)) : 0;
      const className = classIdToName.get(cid) ?? `Kelas ${cid}`;
      return {
        classId: cid,
        className,
        studentCount: students.size,
        records: count,
        average: avg,
      };
    });

    // If there are classes with students but no exam results, include them with average 0
    const classesWithStudents = new Map<string, number>();
    (students || []).forEach((s: any) => {
      const cid = s?.class_id ?? s?.class?.id;
      if (cid != null) {
        const key = String(cid);
        classesWithStudents.set(key, (classesWithStudents.get(key) || 0) + 1);
      }
    });
    for (const [cid, countStudents] of classesWithStudents.entries()) {
      if (!rows.find((r) => r.classId === cid)) {
        rows.push({
          classId: cid,
          className: classIdToName.get(cid) ?? `Kelas ${cid}`,
          studentCount: countStudents,
          records: 0,
          average: 0,
        });
      }
    }

    // Sort by class name
    rows.sort((a, b) => a.className.localeCompare(b.className));
    return rows;
  }, [examResults, studentToClass, classIdToName, students]);

  return (
    <div className="overflow-y-auto min-h-screen">
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">Laporan Rata-rata Nilai per Kelas</h1>
          <p className="text-sm text-gray-600">Ringkasan rata-rata nilai berdasarkan hasil ujian untuk tiap kelas.</p>
        </div>

        {loading && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-700">Memuat data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Kelas</th>
                    <th className="py-2 px-4 text-right">Jumlah Siswa</th>
                    <th className="py-2 px-4 text-right">Jumlah Nilai</th>
                    <th className="py-2 px-4 text-right">Rata-rata</th>
                  </tr>
                </thead>
                <tbody>
                  {classStats.length > 0 ? (
                    classStats.map((row) => (
                      <tr key={row.classId} className="hover:bg-orange-50">
                        <td className="py-3 px-4 font-medium text-gray-800">{row.className}</td>
                        <td className="py-3 px-4 text-right">{row.studentCount}</td>
                        <td className="py-3 px-4 text-right">{row.records}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={
                            row.average >= 90
                              ? "bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-semibold"
                              : row.average <= 80
                              ? "bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold"
                              : "bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-semibold"
                          }>
                            {row.average.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-500">
                        Tidak ada data untuk ditampilkan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}