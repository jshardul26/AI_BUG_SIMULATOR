export default function MetricsCard({ title, value, subtitle, icon, color }) {
  const colorMap = {
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    green: "text-green-400 bg-green-500/10 border-green-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    red: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-violet-500/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-zinc-400 text-sm">{title}</span>
        <span className={`text-xl p-2 rounded-lg border ${colorMap[color]}`}>
          {icon}
        </span>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-zinc-500 text-xs mt-1">{subtitle}</p>
    </div>
  );
}