export default function PipelineCard({ stage, description, status, icon }) {
  const statusStyles = {
    complete: "border-green-500/30 bg-green-500/5",
    active: "border-violet-500/30 bg-violet-500/5 animate-pulse",
    pending: "border-zinc-700 bg-zinc-900",
  };

  const statusBadge = {
    complete: "bg-green-500/20 text-green-400",
    active: "bg-violet-500/20 text-violet-400",
    pending: "bg-zinc-800 text-zinc-500",
  };

  const statusLabel = {
    complete: "Complete",
    active: "Running...",
    pending: "Pending",
  };

  return (
    <div className={`border rounded-xl p-4 transition-all duration-300 ${statusStyles[status]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <span className="text-white font-medium">{stage}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadge[status]}`}>
          {statusLabel[status]}
        </span>
      </div>
      <p className="text-zinc-400 text-sm ml-9">{description}</p>
    </div>
  );
}