import { useState, useEffect } from "react";

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
  const [stats, setStats] = useState(null);
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          fetch("http://localhost:5000/stats"),
          fetch("http://localhost:5000/bug-history"),
        ]);
        const statsData = await statsRes.json();
        const historyData = await historyRes.json();
        setStats(statsData.stats);
        setBugs(historyData.bugs);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = stats ? [
    { label: "Total Analyses", value: stats.totalAnalyses, color: "text-violet-400" },
    { label: "Bugs Resolved", value: stats.bugsResolved, color: "text-green-400" },
    { label: "Critical Issues", value: stats.criticalIssues, color: "text-red-400" },
    { label: "Avg Fix Time", value: stats.avgFixTime, color: "text-blue-400" },
  ] : [];

  return (
    <div className="p-6 text-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1">
          Welcome to BugForge AI — your intelligent debugging assistant.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-zinc-700 rounded mb-3 w-24"></div>
              <div className="h-8 bg-zinc-700 rounded w-16"></div>
            </div>
          ))
        ) : (
          statCards.map((s) => (
            <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-violet-500/30 transition-all duration-300">
              <p className="text-zinc-400 text-sm mb-3">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))
        )}
      </div>

      {/* Recent Bugs Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Bug Analyses</h2>
        {loading ? (
          <div className="text-zinc-500 text-sm">Loading...</div>
        ) : bugs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-500">No bugs analyzed yet.</p>
            <p className="text-zinc-600 text-sm mt-1">Go to Workspace and analyze your first bug!</p>
          </div>
        ) : (
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
                {bugs.map((bug) => (
                  <tr key={bug.id} className="hover:bg-zinc-800/50 transition-colors cursor-pointer">
                    <td className="py-3 text-zinc-500 font-mono">{bug.id}</td>
                    <td className="py-3 text-zinc-300 max-w-xs truncate">{bug.title}</td>
                    <td className="py-3 text-zinc-400">{bug.language}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${severityColor[bug.severity] || "text-zinc-400 bg-zinc-700"}`}>
                        {bug.severity}
                      </span>
                    </td>
                    <td className="py-3 text-zinc-500">{bug.date}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColor[bug.status] || "text-zinc-400 bg-zinc-700"}`}>
                        {bug.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}