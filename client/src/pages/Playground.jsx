import { useState } from "react";
import PlaygroundInput from "../components/Playground/PlaygroundInput";
import PromptExamples from "../components/Playground/PromptExamples";

export default function Playground() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);

  const handleRun = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput(null);
    try {
      const response = await fetch("http://localhost:5000/analyze-bug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: "",
          errorLog: input,
          language: "JavaScript",
        }),
      });
      const data = await response.json();
      setOutput({
        rootCause: data.structuredResponse?.rootCause || data.parsedError?.probableCause,
        fix: data.structuredResponse?.possibleFix || "Check the error details above",
        steps: data.structuredResponse?.reproductionSteps || [],
        severity: data.structuredResponse?.severity || "Medium",
      });
    } catch (error) {
      setOutput({
        rootCause: "Could not connect to backend",
        fix: "Make sure backend is running on port 5000",
        steps: [],
        severity: "Unknown",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white min-h-screen">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Playground</h1>
        <p className="text-zinc-400 mt-1">
          Test bug inputs and preview AI analysis output instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — Input + Examples */}
        <div className="lg:col-span-2 space-y-6">
          <PlaygroundInput
            value={input}
            onChange={setInput}
            onRun={handleRun}
            loading={loading}
          />

          {/* Output */}
          {loading && (
            <div className="bg-zinc-900 border border-violet-500/20 rounded-xl p-6 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></div>
              <span className="text-violet-300 text-sm">AI is analyzing your bug...</span>
            </div>
          )}

          {output && !loading && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
              <h3 className="text-white font-semibold">Analysis Output</h3>

              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm font-medium mb-1">Root Cause</p>
                <p className="text-zinc-300 text-sm">{output.rootCause}</p>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-green-400 text-sm font-medium mb-1">Recommended Fix</p>
                <p className="text-zinc-300 text-sm font-mono">{output.fix}</p>
              </div>

              <div className="bg-zinc-800 rounded-lg p-3">
                <p className="text-zinc-400 text-sm font-medium mb-2">Reproduction Steps</p>
                <ol className="space-y-1">
                  {output.steps.map((step, i) => (
                    <li key={i} className="text-zinc-300 text-sm flex gap-2">
                      <span className="text-violet-400">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-zinc-500 text-sm">Severity:</span>
                <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
                  {output.severity}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right — Examples */}
        <div>
          <PromptExamples onSelect={setInput} />
        </div>

      </div>
    </div>
  );
}