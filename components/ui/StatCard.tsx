interface StatCardProps {
  value: string;
  label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="stat-glow glass-card p-6 text-center group hover:shadow-purple-500/20">
      <p className="text-3xl font-bold gradient-text">{value}</p>
      <p className="mt-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{label}</p>
    </div>
  );
}
