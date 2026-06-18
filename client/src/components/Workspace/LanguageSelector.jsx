export default function LanguageSelector({
  language,
  setLanguage,
}) {
  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="
        bg-zinc-800
        text-white
        px-3
        py-2
        rounded-lg
        border
        border-zinc-700
      "
    >
      <option value="javascript">JavaScript</option>
      <option value="python">Python</option>
      <option value="java">Java</option>
      <option value="cpp">C++</option>
      <option value="typescript">TypeScript</option>
    </select>
  );
}