import LandingView from './LandingView';
import { Suspense, lazy, useMemo, useRef, useState } from 'react';
import ReactFlow, { Background, Controls, MarkerType } from 'reactflow';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import {
  Activity, AlertTriangle, BarChart3, BookOpen, Bot, BrainCircuit,
  CheckCircle2, ChevronRight, Clock3, Code2, Database, Download,
  FileClock, Gauge, History, Home, Layers3, Loader2, LockKeyhole,
  Play, RotateCcw, Search, Settings, ShieldCheck, Sparkles,
  TerminalSquare, Trash2, Zap,
} from 'lucide-react';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const ANALYZE_ENDPOINT = `${API_BASE_URL}/analyze-bug`;
const defaultLog = 'NullPointerException';
const defaultCode = `String name = null;\nSystem.out.println(name.length());`;

const thinkingSteps = [
  'Parsing Error Logs...',
  'Analyzing Stack Trace...',
  'Identifying Root Cause...',
  'Generating Fix Recommendations...',
  'Creating Visual Workflow...',
];

const navItems = [
  { id: 'overview', label: 'Landing Page', icon: Home },
  { id: 'analyze', label: 'Analyze', icon: TerminalSquare },
  { id: 'workflow', label: 'Workflow', icon: Layers3 },
  { id: 'learn', label: 'Learn', icon: BookOpen },
];

const historySeed = [
  { id: 1, title: 'React undefined map', time: '2 min ago', score: 94, tag: 'Frontend', severity: 'High' },
  { id: 2, title: 'Mongo duplicate key', time: 'Yesterday', score: 88, tag: 'Database', severity: 'Medium' },
  { id: 3, title: 'Express CORS failure', time: 'Jun 21', score: 82, tag: 'API', severity: 'Medium' },
];

// Safe array helper — prevents crashes when backend returns null/undefined
function safeArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

// ─── BACKEND FLOWCHART FORMAT ─────────────────────────────────────────────────
// The backend returns flowchart as: [{type: "start"|"process"|"decision"|"error"|"fix"|"success", text: "..."}, ...]
// We normalise it to a plain string array for ReactFlow rendering.
function normaliseFlowchartNode(node) {
  if (!node) return null;
  if (typeof node === 'string') return node.trim() || null;
  // Backend object form: { type, text }
  if (typeof node === 'object' && node.text) return String(node.text).trim() || null;
  return null;
}

// ─── FALLBACK RESPONSE ────────────────────────────────────────────────────────
function createFallbackBackendResponse(code, errorLog) {
  const isNullPointer = /nullpointer|null pointer|null/i.test(`${errorLog} ${code}`);
  return {
    success: true,
    parsedError: {
      errorType: isNullPointer ? 'Null Reference Error' : 'Runtime Exception',
      message: errorLog || code,
      keyword: isNullPointer ? 'null' : 'runtime',
      probableCause: isNullPointer
        ? 'Program tried to use a variable that does not reference a valid object.'
        : 'Program state does not match the expected input shape.',
    },
    structuredResponse: {
      bugPattern: isNullPointer ? 'Null Reference Error' : 'Runtime Exception',
      rootCause: isNullPointer
        ? 'The variable `name` is assigned `null`, then the code calls `name.length()`. Java cannot call methods on a null reference, so it throws NullPointerException.'
        : 'The error log indicates the program used a value in a way that the runtime could not safely execute.',
      flashcards: [
        { question: 'What is null in Java?', answer: 'null means the variable does not currently point to any object.' },
        { question: 'Why does NullPointerException happen?', answer: 'It happens when code tries to access a field or method through a null reference.' },
        { question: 'How can you prevent this bug?', answer: 'Check for null, initialize the value, or use safer control flow before calling methods.' },
      ],
      steps: [
        'Create a variable named `name`.',
        'Assign `null` to the variable.',
        'Call `name.length()`.',
        'Java tries to access a method through null.',
        'NullPointerException is thrown.',
      ],
      fix: 'Initialize `name` with a real string before calling `.length()`, or add a null check before using the variable.',
      correctedCode: `String name = "Codex";\nif (name != null) {\n    System.out.println(name.length());\n}`,
      // fallback flowchart already uses string form — normaliser handles both
      flowchart: [
        { type: 'start', text: 'Create variable' },
        { type: 'process', text: 'Assign null' },
        { type: 'process', text: 'Call method' },
        { type: 'error', text: 'Exception occurs' },
        { type: 'fix', text: 'Add null guard' },
        { type: 'success', text: 'Bug fixed' },
      ],
      quiz: [
        {
          question: 'What is the safest reason to check `name != null`?',
          options: ['To avoid calling methods on no object', 'To make Java faster', 'To create a new class', 'To stop compilation'],
          correctAnswer: 'To avoid calling methods on no object',
        },
      ],
      learningOutcome: 'You can now identify NullPointerException causes and apply null-guard patterns.',
    },
    meta: { source: 'frontend-fallback' },
  };
}
// ─── NORMALISE RESPONSE ───────────────────────────────────────────────────────
// Maps the raw backend payload (or fallback) into the uniform shape the UI needs.
function normalizeBackendResponse(payload, request) {
  const sr = payload?.structuredResponse || {};
  const parsedError = payload?.parsedError || {};

  const flashcards = safeArray(sr.flashcards).map((c) => ({
    question: c?.question || 'No question',
    answer: c?.answer || 'No answer',
  }));

  const steps = safeArray(sr.steps).map((s) => String(s));

  // Normalise flowchart — backend sends [{type, text}], fallback may send strings
  const flowchart = safeArray(sr.flowchart)
    .map(normaliseFlowchartNode)
    .filter(Boolean);

  const quiz = safeArray(sr.quiz).map((q) => ({
    question: q?.question || '',
    options: safeArray(q?.options).map(String),
    correctAnswer: q?.correctAnswer || '',
  }));

  // FIX: AI sometimes returns rootCause as an object {reasons: [...]} instead of a string.
  // Handle all shapes: string, {reasons: []}, {cause: ""}, or any object.
  let rootCause = 'No root cause returned by the backend.';
  if (typeof sr.rootCause === 'string' && sr.rootCause.trim()) {
    rootCause = sr.rootCause.trim();
  } else if (sr.rootCause && typeof sr.rootCause === 'object') {
    if (Array.isArray(sr.rootCause.reasons) && sr.rootCause.reasons.length > 0) {
      // Join the reasons array into a readable paragraph
      rootCause = sr.rootCause.reasons.map((r) => String(r).trim()).filter(Boolean).join(' ');
    } else if (typeof sr.rootCause.cause === 'string' && sr.rootCause.cause.trim()) {
      rootCause = sr.rootCause.cause.trim();
    } else {
      // Last resort: stringify whatever object came back
      rootCause = Object.values(sr.rootCause).flat().map(String).join(' ') || 'No root cause returned.';
    }
  }

  // bugPattern is new backend field — surface it as the severity label when available
  const bugPattern = sr.bugPattern || parsedError.errorType || 'Unknown';

  // learningOutcome is a new backend field — store it for the Learn view
  const learningOutcome = sr.learningOutcome || '';

  // Derive a short display title from rootCause
  const firstSentence = rootCause.match(/[^.!?]+[.!?]/)?.[0]?.trim() || rootCause;
  const title = firstSentence.length > 90 ? firstSentence.slice(0, 87) + '...' : firstSentence;

  // Map bugPattern to a simple High / Medium severity for UI badges
  const highSeverityPatterns = ['Null Reference Error', 'Recursion Error', 'Memory Issue', 'Boundary Error'];
  const severity = highSeverityPatterns.includes(bugPattern) ? 'High' : 'Medium';

  return {
    success: payload?.success !== false,
    title,
    severity,
    bugPattern,
    // Backend doesn't return a confidence score — default to a reasonable constant
    confidence: payload?.meta?.confidence || 91,
    parsedError,
    structuredResponse: {
      rootCause,
      flashcards,
      steps,
      fix: sr.fix || 'No fix recommendation returned.',
      correctedCode: sr.correctedCode || '',
      flowchart,
      quiz,
      learningOutcome,
    },
    source: payload?.meta?.source || 'backend',
  };
}

// ─── API CALL ─────────────────────────────────────────────────────────────────
async function analyzeBugWithBackend(request) {
  const response = await fetch(ANALYZE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    // Backend validation errors come as payload.errors (array)
    // Backend server errors come as payload.message (string)
    const errors = Array.isArray(payload.errors)
      ? payload.errors
      : [payload.message || 'Bug analysis failed.'];

    const error = new Error(errors.join(', '));
    error.validationErrors = errors;
    throw error;
  }

  return normalizeBackendResponse(payload, request);
}

// ─── REACT FLOW BUILDER ───────────────────────────────────────────────────────
const nodeStyle = {
  background: 'rgba(18, 34, 62, 0.96)',
  border: '1px solid rgba(100, 149, 237, 0.5)',
  color: '#f0f8ff',
  borderRadius: 8,
  width: 170,
  fontSize: 12,
  boxShadow: '0 16px 36px rgba(7, 21, 42, 0.34)',
};

function makeFlow(analysis) {
  const chart = analysis.structuredResponse.flowchart.length
    ? analysis.structuredResponse.flowchart
    : ['Error log', 'Parser', 'Root cause', 'Fix', 'Corrected code'];

  const nodes = chart.map((label, index) => ({
    id: String(index + 1),
    position: { x: 40 + (index % 3) * 245, y: 60 + Math.floor(index / 3) * 145 },
    data: { label },
    style: {
      ...nodeStyle,
      borderColor:
        index === chart.length - 1
          ? 'rgba(255, 224, 179, 0.72)'
          : index === 0
            ? 'rgba(179, 219, 253, 0.62)'
            : 'rgba(100, 149, 237, 0.62)',
    },
  }));

  const edges = nodes.slice(0, -1).map((node, index) => ({
    id: `${node.id}-${nodes[index + 1].id}`,
    source: node.id,
    target: nodes[index + 1].id,
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: '#b3dbfd' },
    style: { stroke: '#b3dbfd', strokeWidth: 1.5 },
  }));

  return { nodes, edges };
}

// ─── APP ──────────────────────────────────────────────────────────────────────
function App() {
  const { scrollYProgress } = useScroll();
  const auroraY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const ribbonY = useTransform(scrollYProgress, [0, 1], ['0%', '-24%']);

  const [activeView, setActiveView] = useState('overview');
  const [log, setLog] = useState(defaultLog);
  const [code, setCode] = useState(defaultCode);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step, setStep] = useState(0);
  const [analysis, setAnalysis] = useState(() =>
    normalizeBackendResponse(
      createFallbackBackendResponse(defaultCode, defaultLog),
      { code: defaultCode, errorLog: defaultLog }
    )
  );
  const [history, setHistory] = useState(historySeed);
  const [activeFlashcard, setActiveFlashcard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);
  const flow = useMemo(() => makeFlow(analysis), [analysis]);

  const showToast = (message) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2400);
  };

  const runAnalysis = () => {
    if (!log.trim() && !code.trim()) {
      showToast('Add an error log or code before running analysis.');
      return;
    }

    setIsAnalyzing(true);
    setStep(0);
    setActiveView('analyze');

    const interval = window.setInterval(() => {
      setStep((current) => {
        if (current >= thinkingSteps.length - 1) {
          window.clearInterval(interval);
          window.setTimeout(async () => {
            const request = { code, errorLog: log };
            let next;

            try {
              next = await analyzeBugWithBackend(request);
              showToast('Backend analysis complete.');
            } catch (error) {
              if (error.validationErrors?.length) {
                showToast(error.validationErrors.join(', '));
                setIsAnalyzing(false);
                return;
              }

              next = normalizeBackendResponse(
                createFallbackBackendResponse(code, log),
                request
              );

              showToast('Backend unavailable — showing demo response.');
            }

            setAnalysis(next);
            setActiveFlashcard(0);
            setFlipped(false);

            setHistory((items) => [
              {
                id: crypto.randomUUID(),
                title: next.title,
                time: 'Just now',
                score: next.confidence,
                tag: next.bugPattern,
                severity: next.severity,
              },
              ...items.slice(0, 6),
            ]);

            setIsAnalyzing(false);
          }, 420);

          return current;
        }

        return current + 1;
      });
    }, 560);
  };

  const clearInputs = () => {
    setLog('');
    setCode('');
    showToast('Input workspace cleared.');
  };

  return (
    <main className="app-shell">
      <motion.div className="scroll-grid" style={{ y: gridY }} />
      <motion.div className="scroll-aurora" style={{ y: auroraY }} />
      <motion.div className="scroll-ribbon" style={{ y: ribbonY }} />

      <div
        className={`workspace grid min-h-screen text-slate-100 ${activeView === 'overview'
            ? 'grid-cols-1'
            : 'grid-cols-[252px_1fr] max-[980px]:grid-cols-1'
          }`}
      >
        {activeView !== 'overview' && <Sidebar activeView={activeView} setActiveView={setActiveView} />}

        <section className="min-w-0">
          {activeView !== 'overview' && <Topbar activeView={activeView} isAnalyzing={isAnalyzing} />}

          <div className={activeView === 'overview' ? '' : 'px-5 py-5 max-[640px]:px-3'}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                className="view-stack"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
              >
                {activeView === 'overview' && (
                  <LandingView setActiveView={setActiveView} />
                )}

                {activeView === 'analyze' && (
                  <AnalyzeView
                    log={log}
                    setLog={setLog}
                    code={code}
                    setCode={setCode}
                    analysis={analysis}
                    isAnalyzing={isAnalyzing}
                    step={step}
                    onAnalyze={runAnalysis}
                    onClear={clearInputs}
                  />
                )}

                {activeView === 'workflow' && (
                  <WorkflowView analysis={analysis} flow={flow} isAnalyzing={isAnalyzing} />
                )}

                {activeView === 'learn' && (
                  <LearnView
                    analysis={analysis}
                    activeFlashcard={activeFlashcard}
                    setActiveFlashcard={setActiveFlashcard}
                    flipped={flipped}
                    setFlipped={setFlipped}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-5 right-5 z-30 rounded-lg border border-cyan-400/30 bg-slate-950/95 px-4 py-3 text-sm text-cyan-100 shadow-2xl shadow-cyan-950/40"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ activeView, setActiveView }) {
  return (
    <aside className="panel sticky top-0 z-20 h-screen border-y-0 border-l-0 p-4 max-[980px]:static max-[980px]:h-auto max-[980px]:border-r-0 max-[980px]:border-b">
      <div className="mb-6 flex items-center gap-3">
        <div className="brand-mark grid size-11 place-items-center rounded-lg shadow-lg">
          <Bot size={22} />
        </div>
        <div>
          <div className="text-sm font-semibold">DebugGenie</div>
          <div className="text-xs text-slate-400">Mission Control</div>
        </div> 
      </div>
      <nav className="grid gap-2 max-[980px]:grid-cols-4 max-[640px]:grid-cols-2">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            aria-label={`Navigate to ${label}`}
            onClick={() => setActiveView(id)}
            className={`flex items-center gap-3 rounded-lg border px-3 py-3 text-left text-sm transition ${activeView === id
                ? 'active-nav border-cyan-400/45 bg-cyan-400/10 text-cyan-100 shadow-lg shadow-cyan-950/20'
                : 'border-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-900/45 hover:text-slate-100'
              }`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
function Topbar({ activeView }) {
  const title = navItems.find((item) => item.id === activeView)?.label || 'Overview';
  return (
    <header className="sticky top-0 z-10 border-b border-slate-700/50 bg-slate-950/40 px-5 py-4 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cyan-300">
        <Activity size={14} />
        AI Debugging Mission Control
      </div>
      <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-50">{title}</h1>
    </header>
  );
}

// ─── METRIC CARD ──────────────────────────────────────────────────────────────
function Metric({ icon: Icon, label, value, tone }) {
  const tones = {
    cyan: 'text-cyan-200 bg-cyan-400/10 border-cyan-400/25',
    red: 'text-red-200 bg-red-500/10 border-red-400/25',
    indigo: 'text-indigo-200 bg-indigo-500/10 border-indigo-400/25',
    amber: 'text-amber-200 bg-amber-500/10 border-amber-400/25',
    purple: 'text-purple-200 bg-purple-500/10 border-purple-400/25',
  };
  return (
    <div className="panel rounded-lg p-4">
      <div className={`mb-4 grid size-10 place-items-center rounded-lg border ${tones[tone]}`}>
        <Icon size={19} />
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{label}</div>
    </div>
  );
}

// ─── ANALYZE VIEW ─────────────────────────────────────────────────────────────
function AnalyzeView(props) {
  return (
    <div className="grid grid-cols-[minmax(360px,1fr)_430px] gap-5 max-[1180px]:grid-cols-1">
      <section className="panel rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/60 p-4">
          <div>
            <h2 className="text-base font-semibold">Incident Input</h2>
            <p className="text-sm text-slate-400">Paste an error log, code, or both — then run analysis.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={props.onClear}
              className="glow-hover inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300"
            >
              <Trash2 size={16} />
              Clear
            </button>
            <button
              onClick={props.onAnalyze}
              disabled={props.isAnalyzing}
              className="primary-action glow-hover inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {props.isAnalyzing ? <Loader2 className="animate-spin" size={17} /> : <Play size={17} />}
              Analyze
            </button>
          </div>
        </div>

        <div className="grid gap-4 p-4">

          <label className="grid gap-2 text-sm font-medium text-slate-200">
            Error Log{' '}
            <span className="font-normal text-slate-400">(optional if code provided)</span>
            <textarea
              value={props.log}
              onChange={(e) => props.setLog(e.target.value)}
              placeholder="Paste stack trace or runtime error here..."
              className="h-44 resize-none rounded-lg border border-slate-700 bg-slate-950/70 p-3 font-mono text-sm leading-6 text-slate-100 outline-none focus:border-cyan-400"
            />
          </label>

          <div>
            <div className="mb-2 text-sm font-medium text-slate-200">
              Code{' '}
              <span className="font-normal text-slate-400">(optional if error log provided)</span>
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-700 bg-[#0f172a]">
              <Suspense
                fallback={
                  <div className="shimmer h-[360px] p-4 text-sm text-slate-400">
                    Loading code editor...
                  </div>
                }
              >
                <MonacoEditor
                  height="360px"
                  language="plaintext"
                  theme="vs-dark"
                  value={props.code}
                  onChange={(value) => props.setCode(value ?? '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    wordWrap: 'on',
                    padding: { top: 14 },
                    scrollBeyondLastLine: false,
                  }}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <aside className="grid gap-5">
        <ResultSummary analysis={props.analysis} isAnalyzing={props.isAnalyzing} step={props.step} />
      </aside>
    </div>
  );
}
// ─── WORKFLOW VIEW ────────────────────────────────────────────────────────────
function WorkflowView({ analysis, flow, isAnalyzing }) {
  const structuredResponse = analysis?.structuredResponse || {};

  const correctedCode = structuredResponse.correctedCode || "";
  const learningOutcome = structuredResponse.learningOutcome || "";


  return (
    <div className="grid gap-5">

      <FlowPanel
        flow={flow}
        isAnalyzing={isAnalyzing}
      />


      <div className="grid grid-cols-[1fr_0.9fr] gap-5 max-[980px]:grid-cols-1">

        <Insights analysis={analysis} />

      </div>


      {correctedCode.trim() !== "" && (
        <CodeBlock
          title="Corrected Code"
          code={correctedCode}
        />
      )}


      {learningOutcome && (
        <section className="panel rounded-lg p-4">

          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <BookOpen size={16} /> Learning Outcome
          </div>


          <p className="text-sm leading-6 text-slate-300">
            {learningOutcome}
          </p>

        </section>
      )}

    </div>
  );
}
// ─── LEARN VIEW ───────────────────────────────────────────────────────────────
function LearnView({
  analysis,
  activeFlashcard,
  setActiveFlashcard,
  flipped,
  setFlipped,
}) {
  const structuredResponse = analysis?.structuredResponse || {};

  const flashcards = Array.isArray(structuredResponse.flashcards)
    ? structuredResponse.flashcards
    : [];

  const quiz = Array.isArray(structuredResponse.quiz)
    ? structuredResponse.quiz
    : [];

  const learningOutcome = structuredResponse.learningOutcome || '';

  const safeFlashcards =
    flashcards.length > 0
      ? flashcards
      : [
          {
            question: 'No flashcard available',
            answer: 'Run an analysis to generate learning cards.',
          },
        ];

  const currentIndex = Math.min(
    activeFlashcard,
    safeFlashcards.length - 1
  );

  const currentCard = safeFlashcards[currentIndex];

  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-[1fr_0.85fr] gap-5 max-[980px]:grid-cols-1">

        <section className="panel rounded-lg p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Flashcard Insight
              </h2>

              <p className="text-sm text-slate-400">
                Flip the card to reinforce debugging concepts.
              </p>
            </div>

            <button
              onClick={() => setFlipped((v) => !v)}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-cyan-400 hover:text-cyan-200"
            >
              Flip
            </button>
          </div>


          <button
            onClick={() => setFlipped((v) => !v)}
            className="relative h-64 w-full text-left [perspective:1000px]"
          >
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.45 }}
              className="relative h-full w-full [transform-style:preserve-3d]"
            >

              <div className="card absolute inset-0 grid content-center p-6 [backface-visibility:hidden]">
                <div className="text-xs uppercase text-cyan-300">
                  Question
                </div>

                <p className="mt-3 text-xl font-semibold leading-8">
                  {currentCard.question}
                </p>
              </div>


              <div className="card absolute inset-0 grid content-center p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="text-xs uppercase text-emerald-300">
                  Answer
                </div>

                <p className="mt-3 text-lg leading-8 text-slate-300">
                  {currentCard.answer}
                </p>
              </div>

            </motion.div>
          </button>


          <div className="mt-4 flex gap-2">
            {safeFlashcards.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveFlashcard(index);
                  setFlipped(false);
                }}
                className={`h-2 flex-1 rounded-full ${
                  activeFlashcard === index
                    ? 'bg-cyan-300'
                    : 'bg-slate-700'
                }`}
                title={`Card ${index + 1}`}
              />
            ))}
          </div>
        </section>


        <section className="panel rounded-lg p-5">
          <h2 className="mb-3 text-lg font-semibold">
            Quiz
          </h2>

          {quiz.length === 0 ? (
            <EmptyState
              title="No quiz available"
              body="Run an analysis to generate quiz questions."
            />
          ) : (
            <div className="grid gap-4">
              {quiz.map((item, i) => (
                <div key={i} className="card p-4">

                  <p className="font-medium">
                    {item.question || 'No question'}
                  </p>

                  <div className="mt-3 grid gap-2">
                    {(Array.isArray(item.options)
                      ? item.options
                      : []
                    ).map((option) => (
                      <div
                        key={option}
                        className={`rounded-lg border px-3 py-2 text-sm ${
                          option === item.correctAnswer
                            ? 'border-emerald-400/35 bg-emerald-400/10 text-emerald-100'
                            : 'border-slate-700 bg-slate-950/30 text-slate-300'
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>

      </div>


      {learningOutcome && (
        <section className="panel rounded-lg p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-200">
            <Sparkles size={16} /> Learning Outcome
          </div>

          <p className="text-sm leading-6 text-slate-300">
            {learningOutcome}
          </p>
        </section>
      )}

    </div>
  );
}
/// ─── RESULT SUMMARY ───────────────────────────────────────────────────────────
function ResultSummary({ analysis, isAnalyzing, step }) {
  const structuredResponse = analysis?.structuredResponse || {};
  const rootCause =
    structuredResponse.rootCause || "No root cause returned yet.";

  return (
    <section className="panel rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-cyan-200">
          <BrainCircuit size={18} />
          AI Analysis Panel
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            analysis?.severity === "High"
              ? "bg-red-500/15 text-red-200"
              : "bg-amber-500/15 text-amber-200"
          }`}
        >
          {analysis?.severity || "Unknown"}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div
            key="thinking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-3"
          >
            {thinkingSteps.map((item, index) => (
              <div
                key={item}
                className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${
                  index <= step
                    ? "border-cyan-400/35 bg-cyan-400/10 text-cyan-100"
                    : "border-slate-700/50 bg-slate-900/40 text-slate-500"
                }`}
              >
                {index < step ? (
                  <CheckCircle2 size={17} />
                ) : index === step ? (
                  <Loader2 className="animate-spin" size={17} />
                ) : (
                  <Clock3 size={17} />
                )}

                {item}
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid gap-3"
          >
            <div className="card p-3">
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-100">
                <AlertTriangle size={16} />
                Probable Root Cause
              </div>

              <p className="text-sm leading-6 text-slate-300">
                {rootCause}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── FLOW PANEL ───────────────────────────────────────────────────────────────
function FlowPanel({ flow, isAnalyzing }) {
  const nodes = flow?.nodes || [];
  const edges = flow?.edges || [];

  return (
    <section className="panel min-h-[480px] overflow-hidden rounded-lg">
      <div className="flex items-center justify-between border-b border-slate-700/60 p-4 max-[640px]:items-start max-[640px]:gap-2">

        <div className="flex items-center gap-2 text-sm font-semibold">
          <Layers3 size={17} /> Debugging Workflow
        </div>

        <span className="text-xs text-slate-400">
          Progressive cause-to-fix map
        </span>

      </div>

      <div className="h-[430px]">
        <ReactFlow
          nodes={isAnalyzing ? nodes.slice(0, 3) : nodes}
          edges={isAnalyzing ? edges.slice(0, 2) : edges}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#334155" gap={18} size={1} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </section>
  );
}


// ─── INSIGHTS ─────────────────────────────────────────────────────────────────
function Insights({ analysis }) {
  const fix =
    analysis?.structuredResponse?.fix ||
    'No fix explanation available yet.';

  return (
    <section className="panel overflow-hidden rounded-lg">

      <div className="border-b border-slate-700/60 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles size={17} /> Fix Explanation
        </div>
      </div>

      <div className="grid gap-3 p-4">

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card glow-hover p-4"
        >
          <p className="text-sm leading-7 text-slate-300">
            {fix}
          </p>
        </motion.div>

      </div>

    </section>
  );
}


// ─── CODE BLOCK ───────────────────────────────────────────────────────────────
function CodeBlock({ title, code }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code || '');
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1400);
  };

  return (
    <section className="panel overflow-hidden rounded-lg">

      <div className="flex items-center justify-between border-b border-slate-700/60 p-4">

        <div className="flex items-center gap-2 text-sm font-semibold">
          <Code2 size={17} /> {title}
        </div>

        <button
          onClick={copyCode}
          className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:border-cyan-400 hover:text-cyan-200"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>

      </div>

      <pre className="overflow-auto bg-slate-950/70 p-4 text-sm leading-7 text-slate-100">
        <code>
          {code || '// No corrected code returned yet.'}
        </code>
      </pre>

    </section>
  );
}


// ─── ACTIVITY FEED ────────────────────────────────────────────────────────────
function ActivityFeed({ history }) {
  const safeHistory = Array.isArray(history) ? history : [];

  return (
    <section className="panel rounded-lg p-4">

      <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <FileClock size={17} /> Live Activity
      </div>

      <div className="grid gap-3">

        {safeHistory.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="card flex items-center justify-between gap-3 p-3"
          >

            <div className="min-w-0">

              <div className="truncate text-sm font-medium">
                {item.title}
              </div>

              <div className="mt-1 text-xs text-slate-400">
                {item.tag} · {item.time}
              </div>

            </div>

            <span className="rounded-full bg-indigo-500/15 px-2 py-1 text-xs font-semibold text-indigo-200">
              {item.score}%
            </span>

          </div>
        ))}

      </div>

    </section>
  );
}


// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
function EmptyState({ title, body }) {
  return (
    <div className="grid place-items-center rounded-lg border border-dashed border-slate-700 p-10 text-center">

      <BarChart3
        className="mb-3 text-slate-500"
        size={28}
      />

      <div className="font-semibold">
        {title}
      </div>

      <p className="mt-1 max-w-sm text-sm text-slate-400">
        {body}
      </p>

    </div>
  );
}

export default App;