import PipelineCard from "../components/AIAnalysis/PipelineCard";
import LiveConsole from "../components/AIAnalysis/LiveConsole";

const pipeline = [
  {
    stage: "Parsing Logs",
    description: "Extracting error type, stack trace and keywords from raw logs.",
    status: "complete",
    icon: "📋",
  },
  {
    stage: "Dependency Detection",
    description: "Scanning package versions and identifying conflicting dependencies.",
    status: "complete",
    icon: "🔍",
  },
  {
    stage: "Environment Recreation",
    description: "Rebuilding the exact environment snapshot where the bug occurred.",
    status: "active",
    icon: "⚙️",
  },
  {
    stage: "Failure Simulation",
    description: "Reproducing the failure conditions to confirm the bug trigger.",
    status: "pending",
    icon: "💥",
  },
  {
    stage: "Root Cause Analysis",
    description: "AI identifies the exact root cause and generates fix recommendations.",
    status: "pending",
    icon: "🧠",
  },
];

export default function AIAnalysis() {
  return (
    <div className="p-6 text-white min-h-screen">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">AI Analysis</h1>
        <p className="text-zinc-400 mt-1">
          Real-time AI powered bug reproduction and root cause analysis engine.
        </p>
      </div>

      {/* Status Bar */}
      <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 mb-8 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></div>
        <span className="text-violet-300 text-sm font-medium">
          AI Reproduction Engine is active — Stage 3 of 5 running
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pipeline */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Analysis Pipeline
          </h2>
          <div className="space-y-3">
            {pipeline.map((p) => (
              <PipelineCard key={p.stage} {...p} />
            ))}
          </div>
        </div>

        {/* Console + Root Cause */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Live Stream Console
            </h2>
            <LiveConsole />
          </div>

          {/* Root Cause Panel */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-white mb-4">
              Root Cause Analysis
            </h2>
            <div className="space-y-3">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm font-medium">Primary Cause</p>
                <p className="text-zinc-300 text-sm mt-1">
                  Calling .map() on undefined — API response not validated before use.
                </p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-yellow-400 text-sm font-medium">Contributing Factor</p>
                <p className="text-zinc-300 text-sm mt-1">
                  Missing null check on response.data before destructuring.
                </p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-green-400 text-sm font-medium">Recommended Fix</p>
                <p className="text-zinc-300 text-sm mt-1">
                  Use optional chaining: <code className="text-violet-400">response.data?.map()</code> or add a fallback array.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}