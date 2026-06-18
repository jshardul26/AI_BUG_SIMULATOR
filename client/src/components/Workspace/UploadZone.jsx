export default function UploadZone() {
  return (
    <div className="
      border-2
      border-dashed
      border-zinc-700
      rounded-2xl
      p-12
      bg-zinc-900
      text-center
      hover:border-violet-500
      transition
    ">
      <div className="text-5xl mb-4">
        📂
      </div>

      <h2 className="text-white text-2xl font-semibold">
        Drag & Drop Files
      </h2>

      <p className="text-zinc-400 mt-3">
        Logs, HAR files, crash reports or screenshots
      </p>

      <button className="
        mt-5
        px-4
        py-2
        rounded-lg
        bg-zinc-800
        text-white
      ">
        Browse Files
      </button>
    </div>
  );
}