export default function GuruCard({ tugas }: any) {
  return (
    <div className="py-3">
      <h3 className="text-base font-semibold">{tugas.title}</h3>
      <p className="text-sm text-gray-500">Kelas: {tugas.class?.name || "Tanpa Kelas"}</p>
      <p className="text-xs text-gray-400">Deadline: {tugas.deadline || "-"}</p>
    </div>
  );
}