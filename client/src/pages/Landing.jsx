import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "AI Root Cause Analysis",
    description: "Instantly identifies the exact root cause of any bug using advanced AI models.",
  },
  {

    title: "Smart Log Parsing",
    description: "Automatically extracts error types, stack traces and keywords from raw logs.",
  },
  {

    title: "Visual Flowcharts",
    description: "Converts complex bug flows into clean, easy to understand visual diagrams.",
  },
  {

    title: "Lightning Fast",
    description: "Get structured debugging insights in seconds, not hours.",
  },
  {

    title: "Flashcard Learning",
    description: "Learn from your bugs with auto-generated flashcards for each error.",
  },
  {

    title: "Analytics Dashboard",
    description: "Track bug trends, severity distribution and team performance over time.",
  },
];

const steps = [
  {
    number: "01",
    title: "Paste Your Error",
    description: "Drop your error log or code snippet into the workspace editor.",
  },
  {
    number: "02",
    title: "AI Analyzes It",
    description: "Our AI engine parses, detects dependencies and simulates the failure.",
  },
  {
    number: "03",
    title: "Get the Fix",
    description: "Receive root cause, reproduction steps, flowchart and recommended fix instantly.",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-zinc-800/50">
        <h1 className="text-2xl font-bold text-violet-400">BugForge.ai</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/auth")}
            className="text-zinc-400 hover:text-white text-sm transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-32 overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <span className="inline-block bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs px-4 py-1.5 rounded-full mb-6">

            AI Powered Bug Reproduction Engine
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6 max-w-4xl text-center mx-auto">
            Debug Smarter with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">
              AI-Powered
            </span>{" "}
            Insights
          </h1>

          <p className="text-zinc-400 text-lg max-w-2xl mb-10 text-center mx-auto">
            BugForge.ai converts your error logs into root causes, reproduction steps,
            fix flowcharts and flashcards — instantly.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20"
            >
              Start Debugging Free →
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="border border-zinc-700 hover:border-violet-500/50 text-zinc-300 hover:text-white px-8 py-3.5 rounded-xl text-base transition-all duration-200"
            >
              See Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">
            Everything You Need to Fix Bugs Faster
          </h2>
          <p className="text-zinc-400">
            Powerful AI tools built for developers who value their time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300"
            >
              <span className="text-3xl mb-4 block">{f.icon}</span>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-zinc-400 text-sm">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-8 py-20 bg-zinc-900/50 border-y border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-zinc-400">Three simple steps to go from bug to fix.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="relative text-center">
                <div className="w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-violet-400 font-bold text-xl">{step.number}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-violet-500/30 to-transparent"></div>
                )}
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-zinc-400 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-8 py-28 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[300px] bg-violet-600/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Fix Bugs Faster?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Join thousands of developers using BugForge.ai to debug smarter.
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="bg-violet-600 hover:bg-violet-700 text-white px-10 py-4 rounded-xl text-base font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20"
          >
            Get Started for Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-8 py-6 flex items-center justify-between">
        <p className="text-violet-400 font-bold">BugForge.ai</p>
        <p className="text-zinc-500 text-sm">Built for Hackathon 2026</p>
      </footer>

    </div>
  );
}