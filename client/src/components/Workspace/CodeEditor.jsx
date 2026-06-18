export default function CodeEditor() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-sm">
            Auto Detect
          </span>

          <span className="bg-violet-600 text-white px-3 py-1 rounded-full text-sm">
            GPT-5
          </span>
        </div>
      </div>

      <textarea
        placeholder="Paste your code snippet here..."
        className="w-full h-72 bg-zinc-950 text-zinc-200 p-4 rounded-xl resize-none outline-none"
      />
    </div>
  );
}