const templates = [
  {
    title: "React Hydration Mismatch",
    desc: "Server and client HTML mismatch"
  },
  {
    title: "Stripe Webhook 500",
    desc: "Webhook endpoint returning errors"
  },
  {
    title: "Node Crash",
    desc: "Unexpected server termination"
  },
  {
    title: "PostgreSQL Deadlock",
    desc: "Database lock conflict"
  },
];

export default function TemplateCards() {
  return (
    <div>
      <h2 className="text-white text-xl font-semibold mb-4">
        One-Click Templates
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {templates.map((item) => (
          <div
            key={item.title}
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-2xl
              p-5
              hover:border-violet-500
              hover:-translate-y-1
              transition
              cursor-pointer
            "
          >
            <h3 className="text-white font-semibold">
              {item.title}
            </h3>

            <p className="text-zinc-400 text-sm mt-2">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}