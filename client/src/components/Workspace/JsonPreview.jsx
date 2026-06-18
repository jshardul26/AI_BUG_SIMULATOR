export default function JsonPreview({
  language,
  code,
  errorLog,
}) {
  const payload = {
    language,
    code,
    errorLog,
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
      <h2 className="text-white text-xl font-semibold mb-3">
        JSON Payload Preview
      </h2>

      <pre className="bg-zinc-950 text-green-400 p-4 rounded-xl overflow-x-auto">
        {JSON.stringify(payload, null, 2)}
      </pre>
    </div>
  );
}