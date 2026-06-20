const stats = [
  { label: "Total Analyses", value: "1,284", icon: "🧠", color: "text-violet-400" },
  { label: "Bugs Resolved", value: "947", icon: "✅", color: "text-green-400" },
  { label: "Critical Issues", value: "38", icon: "🔴", color: "text-red-400" },
  { label: "Avg Fix Time", value: "2.4h", icon: "⚡", color: "text-blue-400" },
];

const recentBugs = [
  { id: "#1042", title: "TypeError: Cannot read properties of undefined", severity: "Critical", status: "Analyzing", lang: "JavaScript" },
  { id: "#1041", title: "NullPointerException in UserService.java", severity: "High", status: "Resolved", lang: "Java" },
  { id: "#1040", title: "KeyError: user_id not found in response dict", severity: "Medium", status: "Resolved", lang: "Python" },
  { id: "#1039", title: "Segmentation fault in vector::operator[]", severity: "Critical", status: "Pending", lang: "C++" },
  { id: "#1038", title: "UnhandledPromiseRejection in async fetch", severity: "High", status: "Resolved", lang: "JavaScript" },
];

const severityColor = {
  Critical: "text-red-400 bg-red-500/10",
  High: "text-orange-400 bg-orange-500/10",
  Medium: "text-yellow-400 bg-yellow-500/10",
  Low: "text-green-400 bg-green-500/10",
};

const statusColor = {
  Analyzing: "text-violet-400 bg-violet-500/10",
  Resolved: "text-green-400 bg-green-500/10",
  Pending: "text-zinc-400 bg-zinc-700",
};

export default function Dashboard() {
  return (
    <div className="p-6 text-white min-h-screen">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1">
          Welcome to BugForge AI — your intelligent debugging assistant.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-violet-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-400 text-sm">{s.label}</span>
              <span className="text-2xl">{s.icon}</span>
            </div>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Bugs Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Bug Analyses</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-500 border-b border-zinc-800">
                <th className="text-left pb-3 font-medium">ID</th>
                <th className="text-left pb-3 font-medium">Title</th>
                <th className="text-left pb-3 font-medium">Language</th>
                <th className="text-left pb-3 font-medium">Severity</th>
                <th className="text-left pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {recentBugs.map((bug) => (
                <tr key={bug.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="py-3 text-zinc-500 font-mono">{bug.id}</td>
                  <td className="py-3 text-zinc-300 max-w-xs truncate">{bug.title}</td>
                  <td className="py-3 text-zinc-400">{bug.lang}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${severityColor[bug.severity]}`}>
                      {bug.severity}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor[bug.status]}`}>
                      {bug.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}