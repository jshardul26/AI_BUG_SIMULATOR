const examples = [
  {
    title: "TypeError — Undefined",
    tag: "JavaScript",
    tagColor: "text-yellow-400 bg-yellow-500/10",
    prompt: "TypeError: Cannot read properties of undefined (reading 'map')\n    at Dashboard.jsx:25\n    at App.jsx:12",
  },
  {
    title: "NullPointerException",
    tag: "Java",
    tagColor: "text-orange-400 bg-orange-500/10",
    prompt: "java.lang.NullPointerException: Cannot invoke method getName()\n    at UserService.java:45\n    at MainController.java:23",
  },
  {
    title: "KeyError — Dict Access",
    tag: "Python",
    tagColor: "text-blue-400 bg-blue-500/10",
    prompt: "KeyError: 'user_id'\n    File 'app.py', line 34, in get_user\n    return data['user_id']",
  },
  {
    title: "Segmentation Fault",
    tag: "C++",
    tagColor: "text-red-400 bg-red-500/10",
    prompt: "Segmentation fault (core dumped)\n    #0 0x00007f in std::vector<int>::operator[]\n    #1 0x00004c in main()",
  },
];

export default function PromptExamples({ onSelect }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4">Sample Bug Inputs</h3>
      <div className="space-y-3">
        {examples.map((ex) => (
          <div
            key={ex.title}
            onClick={() => onSelect(ex.prompt)}
            className="border border-zinc-700 hover:border-violet-500/40 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-violet-500/5"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-white text-sm font-medium">{ex.title}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${ex.tagColor}`}>
                {ex.tag}
              </span>
            </div>
            <p className="text-zinc-500 text-xs font-mono truncate">{ex.prompt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}