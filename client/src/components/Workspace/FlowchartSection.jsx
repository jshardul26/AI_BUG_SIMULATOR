export default function FlowchartSection({
  selectedTemplate,
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <h2 className="text-white text-xl font-semibold mb-6">
        Debugging Flow
      </h2>

      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-red-500/20 border border-red-500 px-6 py-3 rounded-xl text-white">
          Error Detected
        </div>

        <div className="text-violet-400 text-2xl">↓</div>

        <div className="bg-yellow-500/20 border border-yellow-500 px-6 py-3 rounded-xl text-white">
          Root Cause Analysis
        </div>

        <div className="text-violet-400 text-2xl">↓</div>

        <div className="bg-green-500/20 border border-green-500 px-6 py-3 rounded-xl text-white">
          Suggested Fix
        </div>
      </div>
    </div>
  );
}