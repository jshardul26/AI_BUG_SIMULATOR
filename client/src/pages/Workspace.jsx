import { useState, useEffect } from "react";

import CodeEditor from "../components/Workspace/CodeEditor";
import ErrorLogInput from "../components/Workspace/ErrorLogInput";
import JsonPreview from "../components/Workspace/JsonPreview";
import AnalysisResult from "../components/Workspace/AnalysisResult";
import FlashcardSection from "../components/Workspace/FlashcardSection";
import FlowchartSection from "../components/Workspace/FlowchartSection";
import AIReport from "../components/Workspace/AIReport";
import UploadZone from "../components/Workspace/UploadZone";
import TemplateCards from "../components/Workspace/TemplateCards";
import ReproduceButton from "../components/Workspace/ReproduceButton";

export default function Workspace() {
  const [language, setLanguage] = useState("javascript");

  const [code, setCode] = useState(
    localStorage.getItem("bugforge_code") || ""
  );

  const [errorLog, setErrorLog] = useState(
    localStorage.getItem("bugforge_logs") || ""
  );

  const [showResult, setShowResult] = useState(false);

  const [selectedTemplate, setSelectedTemplate] =
    useState("React Hydration Mismatch");

  // NEW: analysis response from service
  const [analysisData, setAnalysisData] = useState(null);

  // Auto-save code
  useEffect(() => {
    localStorage.setItem("bugforge_code", code);
  }, [code]);

  // Auto-save logs
  useEffect(() => {
    localStorage.setItem("bugforge_logs", errorLog);
  }, [errorLog]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">
        Bug Submission Workspace
      </h1>

      <CodeEditor
        language={language}
        setLanguage={setLanguage}
        code={code}
        setCode={setCode}
      />

      <ErrorLogInput
        errorLog={errorLog}
        setErrorLog={setErrorLog}
      />

      <JsonPreview
        language={language}
        code={code}
        errorLog={errorLog}
      />

      {showResult && (
        <>
          <AnalysisResult
            selectedTemplate={selectedTemplate}
            analysisData={analysisData}
          />

          <FlashcardSection
            selectedTemplate={selectedTemplate}
          />

          <FlowchartSection
            selectedTemplate={selectedTemplate}
          />

          <AIReport
            selectedTemplate={selectedTemplate}
          />
        </>
      )}

      <UploadZone />

      <TemplateCards
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
      />

      <div className="flex justify-end">
        <ReproduceButton
          setShowResult={setShowResult}
          setAnalysisData={setAnalysisData}
          code={code}
          errorLog={errorLog}
          language={language}
          selectedTemplate={selectedTemplate}
        />
      </div>
    </div>
  );
}