export default function AIReport({ selectedTemplate }) {
  const reports = {
    "React Hydration Mismatch":
      "The issue occurs because server-rendered HTML differs from client-rendered HTML. React hydration fails when content changes before hydration completes.",

    "Node Crash":
      "The Node.js process terminated due to an unhandled exception. Error boundaries and centralized logging should be added.",

    "Stripe Webhook 500":
      "Stripe webhook requests are failing due to signature validation or endpoint configuration issues.",

    "PostgreSQL Deadlock":
      "Multiple transactions are competing for the same database resources, causing a deadlock.",
  };

  const handleExport = () => {
    alert("Report exported successfully!");
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <h2 className="text-white text-xl font-semibold mb-4">
        AI Generated Report
      </h2>

      <div className="bg-zinc-950 rounded-xl p-4 text-zinc-300 leading-7">
        {reports[selectedTemplate]}
      </div>

      <button
        onClick={handleExport}
        className="
          mt-4
          bg-violet-600
          hover:bg-violet-700
          text-white
          px-4
          py-2
          rounded-lg
        "
      >
        Export Report
      </button>
    </div>
  );
}