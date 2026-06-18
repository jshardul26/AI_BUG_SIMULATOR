export default function AnalysisResult({
  selectedTemplate,
  analysisData,
}) {
  const results = {
    "React Hydration Mismatch": {
      cause:
        "Server HTML differs from Client HTML rendering.",
      fix:
        "Move browser-only code into useEffect() and avoid rendering mismatched content.",
      confidence: "96%",
      severity: "Medium",
    },

    "Stripe Webhook 500": {
      cause:
        "Webhook signature validation failed.",
      fix:
        "Verify Stripe endpoint secret and request payload.",
      confidence: "92%",
      severity: "High",
    },

    "Node Crash": {
      cause:
        "Unhandled exception terminated the Node process.",
      fix:
        "Add try/catch blocks and proper error handling.",
      confidence: "94%",
      severity: "High",
    },

    "PostgreSQL Deadlock": {
      cause:
        "Conflicting database locks caused a deadlock.",
      fix:
        "Retry transactions and reduce lock duration.",
      confidence: "97%",
      severity: "Critical",
    },
  };

  const fallback = results[selectedTemplate];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
      <h2 className="text-white text-xl font-semibold mb-4">
        Analysis Result
      </h2>

      <div className="bg-zinc-950 rounded-xl p-4 text-zinc-300">
        <p className="mb-4">
          <strong>Template:</strong>
          <br />
          {selectedTemplate}
        </p>

        <p className="mb-4">
          <strong>Confidence Score:</strong>
          <br />
          {analysisData?.confidence ||
            fallback.confidence}
        </p>

        <p className="mb-4">
          <strong>Severity:</strong>
          <br />
          {analysisData?.severity ||
            fallback.severity}
        </p>

        <p className="mb-4">
          <strong>Root Cause:</strong>
          <br />
          {analysisData?.rootCause ||
            fallback.cause}
        </p>

        <p>
          <strong>Possible Fix:</strong>
          <br />
          {fallback.fix}
        </p>
      </div>
    </div>
  );
}