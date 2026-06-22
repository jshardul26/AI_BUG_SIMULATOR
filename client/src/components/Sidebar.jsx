import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Code2, Brain, FileText, PlayCircle, BarChart2 } from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { path: "/workspace", label: "Workspace", icon: <Code2 size={16} /> },
  { path: "/analysis", label: "AI Analysis", icon: <Brain size={16} /> },
  { path: "/reports", label: "Reports", icon: <FileText size={16} /> },
  { path: "/playground", label: "Playground", icon: <PlayCircle size={16} /> },
  { path: "/analytics", label: "Analytics", icon: <BarChart2 size={16} /> },
];
export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-zinc-900 border-r border-zinc-800 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-violet-400">
          BugForge.ai
        </h1>
        <p className="text-zinc-500 text-xs mt-1">AI Bug Reproduction Engine</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 
                ${isActive
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800">
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3">
          <p className="text-violet-300 text-xs font-medium">AI Engine Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-zinc-400 text-xs">Online & Ready</span>
          </div>
        </div>
      </div>
    </aside>
  );
}