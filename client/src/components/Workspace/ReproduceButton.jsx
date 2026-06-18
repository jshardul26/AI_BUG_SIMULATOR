import { useState } from "react";
import { analyzeBug } from "../../services/bugAnalysisService";

export default function ReproduceButton({
  setShowResult,
  setAnalysisData,
  code,
  errorLog,
  language,
  selectedTemplate,
}) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!code.trim() && !errorLog.trim()) {
      setError(
        "Please enter code or error logs first."
      );
      return;
    }

    setError("");
    setShowResult(false);
    setLoading(true);

    setStatus("Analyzing Logs...");

    const payload = {
      language,
      code,
      errorLog,
      template: selectedTemplate,
    };

    setTimeout(() => {
      setStatus("Finding Root Cause...");
    }, 1000);

    setTimeout(() => {
      setStatus("Generating Flashcards...");
    }, 2000);

    setTimeout(() => {
      setStatus("Creating Report...");
    }, 3000);

    try {
      const response = await analyzeBug(payload);

      setAnalysisData(response);

      setTimeout(() => {
        setLoading(false);
        setShowResult(true);
        setStatus("");
      }, 4000);
    } catch (err) {
      setError("Analysis failed.");
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      {error && (
        <p className="text-red-400 text-sm">
          {error}
        </p>
      )}

      {loading && (
        <p className="text-violet-400 text-sm">
          {status}
        </p>
      )}

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="
          bg-violet-600
          hover:bg-violet-700
          text-white
          px-6
          py-3
          rounded-xl
          font-semibold
          disabled:opacity-50
        "
      >
        {loading
          ? "Processing..."
          : "Analyze Bug"}
      </button>
    </div>
  );
}