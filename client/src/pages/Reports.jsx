const reports = [
  { id: "#R-201", title: "TypeError undefined map()", lang: "JavaScript", severity: "Critical", date: "20 Jun 2026", status: "Resolved" },
  { id: "#R-200", title: "NullPointerException UserService", lang: "Java", severity: "High", date: "19 Jun 2026", status: "Resolved" },
  { id: "#R-199", title: "KeyError user_id dict access", lang: "Python", severity: "Medium", date: "18 Jun 2026", status: "Pending" },
  { id: "#R-198", title: "Segmentation fault vector operator", lang: "C++", severity: "Critical", date: "17 Jun 2026", status: "Resolved" },
  { id: "#R-197", title: "UnhandledPromiseRejection fetch", lang: "JavaScript", severity: "High", date: "16 Jun 2026", status: "Resolved" },
  { id: "#R-196", title: "IndexError list out of range", lang: "Python", severity: "Low", date: "15 Jun 2026", status: "Resolved" },
];

const severityColor = {
  Critical: "text-red-400 bg-red-500/10",
  High: "text-orange-400 bg-orange-500/10",
  Medium: "text-yellow-400 bg-yellow-500/10",
  Low: "text-green-400 bg-green-500/10",
};

const statusColor = {
  Resolved: "text-green-400 bg-green-500/10",
  Pending: "text-zinc-400 bg-zinc-700",
};

export default function Reports() {
  return (
    <div className="p-6 text-white min-h-screen">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Reports</h1>
        <p className="text-zinc-400 mt-1">
          Full history of all bug analyses and resolutions.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-400 text-sm">Total Reports</p>
          <p className="text-3xl font-bold text-white mt-1">201</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-400 text-sm">Resolved</p>
          <p className="text-3xl font-bold text-green-400 mt-1">183</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-400 text-sm">Pending</p>
          <p className="text-3xl font-bold text-yellow-400 mt-1">18</p>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">All Reports</h2>
          <button className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-2 rounded-lg transition-all duration-200">
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-500 border-b border-zinc-800">
                <th className="text-left pb-3 font-medium">ID</th>
                <th className="text-left pb-3 font-medium">Title</th>
                <th className="text-left pb-3 font-medium">Language</th>
                <th className="text-left pb-3 font-medium">Severity</th>
                <th className="text-left pb-3 font-medium">Date</th>
                <th className="text-left pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-800/50 transition-colors cursor-pointer">
                  <td className="py-3 text-zinc-500 font-mono">{r.id}</td>
                  <td className="py-3 text-zinc-300">{r.title}</td>
                  <td className="py-3 text-zinc-400">{r.lang}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${severityColor[r.severity]}`}>
                      {r.severity}
                    </span>
                  </td>
                  <td className="py-3 text-zinc-500">{r.date}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor[r.status]}`}>
                      {r.status}
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