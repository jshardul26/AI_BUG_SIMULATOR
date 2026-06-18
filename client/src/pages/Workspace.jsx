import CodeEditor from "../components/Workspace/CodeEditor";
import UploadZone from "../components/Workspace/UploadZone";
import TemplateCards from "../components/Workspace/TemplateCards";
import ReproduceButton from "../components/Workspace/ReproduceButton";

export default function Workspace() {
  return (
    <div className="p-8 space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">
          Bug Submission Workspace
        </h1>

        <p className="text-zinc-400 mt-2">
          Submit code snippets, logs, screenshots and reproduce bugs instantly.
        </p>
      </div>

      {/* Code Editor */}
      <CodeEditor />

      {/* Upload Area */}
      <UploadZone />

      {/* Templates */}
      <TemplateCards />

      {/* Action Button */}
      <div className="flex justify-end">
        <ReproduceButton />
      </div>

    </div>
  );
}