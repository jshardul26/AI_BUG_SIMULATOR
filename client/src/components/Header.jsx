export default function Header() {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6">
      <input
        type="text"
        placeholder="Search bugs, traces, environments..."
        className="bg-zinc-800 text-white px-4 py-2 rounded-lg w-96 outline-none"
      />

      <button className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg text-white">
        + New Analysis
      </button>
    </header>
  );
}