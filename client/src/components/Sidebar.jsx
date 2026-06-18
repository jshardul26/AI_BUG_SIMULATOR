import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-zinc-900 border-r border-zinc-800 text-white">
      <div className="p-5">
        <h1 className="text-2xl font-bold text-violet-500">
          BugForge.ai
        </h1>

        <nav className="mt-8 flex flex-col gap-4">
          <Link to="/">Dashboard</Link>
          <Link to="/workspace">Workspace</Link>
          <Link to="/analysis">AI Analysis</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/playground">Playground</Link>
          <Link to="/analytics">Analytics</Link>
          <Link to="/team">Team</Link>
        </nav>
      </div>
    </aside>
  );
}