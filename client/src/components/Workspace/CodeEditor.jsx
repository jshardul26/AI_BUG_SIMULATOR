import Editor from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";

export default function CodeEditor({
  language,
  setLanguage,
  code,
  setCode,
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3 items-center">
          <LanguageSelector
            language={language}
            setLanguage={setLanguage}
          />

          <span className="bg-violet-600 text-white px-3 py-2 rounded-lg text-sm">
            GPT-5
          </span>
        </div>
      </div>

      <Editor
        height="400px"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={(value) => setCode(value || "")}
      />
    </div>
  );
}