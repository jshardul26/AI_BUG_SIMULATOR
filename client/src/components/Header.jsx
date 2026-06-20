import { useLocation } from "react-router-dom";

const pageTitles = {
  "/": "Dashboard",
  "/workspace": "Workspace",
  "/analysis": "AI Analysis",
  "/reports": "Reports",
  "/playground": "Playground",
  "/analytics": "Analytics",
  "/team": "Team",
};

export default function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "BugForge";

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-white font-semibold text-lg">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search bugs, traces, environments..."
          className="bg-zinc-800 text-white placeholder-zinc-500 px-4 py-2 rounded-lg w-80 outline-none border border-zinc-700 focus:border-violet-500/50 text-sm transition-colors"
        />
        <button className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 flex items-center gap-2">
          <span>+</span> New Analysis
        </button>
        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold">
          S
        </div>
      </div>
    </header>
  );
}