export default function UploadZone({
  setErrorLog,
}) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      setErrorLog(e.target.result);
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
      <h2 className="text-white text-xl font-semibold mb-3">
        Upload Error Logs
      </h2>

      <input
        type="file"
        accept=".txt,.log"
        onChange={handleFileUpload}
        className="text-white"
      />
    </div>
  );
}