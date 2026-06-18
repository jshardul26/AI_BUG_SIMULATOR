export default function FlashcardSection({
  selectedTemplate,
}) {
  const flashcards = {
    "React Hydration Mismatch": [
      {
        title: "Hydration",
        content:
          "React attaches event listeners to server-rendered HTML.",
      },
      {
        title: "Common Cause",
        content:
          "Server and client render different content.",
      },
    ],

    "Node Crash": [
      {
        title: "Crash",
        content:
          "Process terminated due to unhandled exception.",
      },
      {
        title: "Fix",
        content:
          "Use try/catch and centralized error handling.",
      },
    ],

    "Stripe Webhook 500": [
      {
        title: "Webhook",
        content:
          "Stripe sends events to your backend endpoint.",
      },
      {
        title: "Fix",
        content:
          "Verify signature and endpoint secret.",
      },
    ],

    "PostgreSQL Deadlock": [
      {
        title: "Deadlock",
        content:
          "Two transactions wait for each other.",
      },
      {
        title: "Fix",
        content:
          "Retry transactions and reduce lock scope.",
      },
    ],
  };

  const cards = flashcards[selectedTemplate];

  return (
    <div>
      <h2 className="text-white text-xl font-semibold mb-4">
        Learning Flashcards
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-2xl
              p-5
            "
          >
            <h3 className="text-white font-semibold mb-2">
              {card.title}
            </h3>

            <p className="text-zinc-400">
              {card.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}