export default function ErrorLogInput({
  errorLog,
  setErrorLog,
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
      <h2 className="text-white text-xl font-semibold mb-3">
        Error Logs
      </h2>

      <p className="text-zinc-400 text-sm mb-4">
        Paste stack traces, console errors or crash reports.
      </p>

      <textarea
        value={errorLog}
        onChange={(e) => setErrorLog(e.target.value)}
        placeholder={`TypeError: Cannot read properties of undefined

at Dashboard.jsx:25
at App.jsx:12`}
        className="
          w-full
          h-40
          bg-zinc-950
          text-zinc-200
          p-4
          rounded-xl
          resize-none
          outline-none
          border
          border-zinc-800
        "
      />
    </div>
  );
}