export default function AdminCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-3xl font-bold text-orange-600 mt-2">{value}</p>
    </div>
  );
}
