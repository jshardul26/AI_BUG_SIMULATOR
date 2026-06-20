export default function PlaygroundInput({ value, onChange, onRun, loading }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-3">Prompt Testing Area</h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your error log or bug description here to test AI analysis..."
        className="w-full h-48 bg-zinc-950 border border-zinc-700 rounded-lg p-4 text-zinc-300 text-sm font-mono outline-none resize-none focus:border-violet-500/50 transition-colors"
      />
      <div className="flex items-center justify-between mt-3">
        <span className="text-zinc-500 text-xs">
          {value.length} characters
        </span>
        <button
          onClick={onRun}
          disabled={loading || !value.trim()}
          className="bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        >
          {loading ? "Analyzing..." : "▶ Run Analysis"}
        </button>
      </div>
    </div>
  );
}