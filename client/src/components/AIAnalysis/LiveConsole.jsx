const logs = [
  { time: "00:00:01", message: "Initializing AI Bug Reproduction Engine...", type: "info" },
  { time: "00:00:02", message: "Parsing error logs and stack traces...", type: "info" },
  { time: "00:00:03", message: "Detected language: JavaScript", type: "success" },
  { time: "00:00:04", message: "Extracting dependency tree...", type: "info" },
  { time: "00:00:05", message: "WARNING: Null reference detected at line 42", type: "warning" },
  { time: "00:00:06", message: "Recreating environment snapshot...", type: "info" },
  { time: "00:00:07", message: "Simulating failure conditions...", type: "info" },
  { time: "00:00:08", message: "ERROR: Cannot read properties of undefined", type: "error" },
  { time: "00:00:09", message: "Root cause identified successfully", type: "success" },
  { time: "00:00:10", message: "Generating fix recommendations...", type: "success" },
];

const typeStyles = {
  info: "text-zinc-400",
  success: "text-green-400",
  warning: "text-yellow-400",
  error: "text-red-400",
};

const typePrefix = {
  info: "[INFO]",
  success: "[OK]",
  warning: "[WARN]",
  error: "[ERR]",
};

export default function LiveConsole() {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-zinc-500 text-sm ml-2">live_console.log</span>
      </div>
      <div className="space-y-2 font-mono text-sm max-h-64 overflow-y-auto">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-zinc-600 shrink-0">{log.time}</span>
            <span className={`shrink-0 ${typeStyles[log.type]}`}>
              {typePrefix[log.type]}
            </span>
            <span className="text-zinc-300">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}