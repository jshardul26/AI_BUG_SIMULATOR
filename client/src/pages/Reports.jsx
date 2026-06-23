import { useState, useEffect } from "react";

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
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/bug-history");
        const data = await res.json();
        setBugs(data.bugs);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const resolved = bugs.filter(b => b.status === "Resolved").length;
  const pending = bugs.filter(b => b.status === "Pending").length;

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
          <p className="text-3xl font-bold text-white mt-1">{bugs.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-400 text-sm">Resolved</p>
          <p className="text-3xl font-bold text-green-400 mt-1">{resolved}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-400 text-sm">Pending</p>
          <p className="text-3xl font-bold text-yellow-400 mt-1">{pending}</p>
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

        {loading ? (
          <div className="text-zinc-500 text-sm">Loading...</div>
        ) : bugs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-500">No reports yet.</p>
            <p className="text-zinc-600 text-sm mt-1">
              Go to Workspace and analyze your first bug!
            </p>
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