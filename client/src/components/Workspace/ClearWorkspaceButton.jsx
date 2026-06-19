export default function ClearWorkspaceButton({
  setCode,
  setErrorLog,
  setShowResult,
  setSelectedTemplate,
}) {
  const handleClear = () => {
    setCode("");
    setErrorLog("");
    setShowResult(false);

    setSelectedTemplate(
      "React Hydration Mismatch"
    );

    localStorage.removeItem("bugforge_code");
    localStorage.removeItem("bugforge_logs");
  };

  return (
    <button
      onClick={handleClear}
      className="
        bg-red-600
        hover:bg-red-700
        text-white
        px-6
        py-3
        rounded-xl
        font-semibold
      "
    >
      Clear Workspace
    </button>
  );
}