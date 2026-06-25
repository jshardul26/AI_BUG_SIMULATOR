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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
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
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'analyze', label: 'Analyze', icon: TerminalSquare },
  { id: 'workflow', label: 'Workflow', icon: Layers3 },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'history', label: 'History', icon: History },
  { id: 'reports', label: 'Reports', icon: Database },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const historySeed = [
  { id: 1, title: 'React undefined map', time: '2 min ago', score: 94, tag: 'Frontend', severity: 'High' },
  { id: 2, title: 'Mongo duplicate key', time: 'Yesterday', score: 88, tag: 'Database', severity: 'Medium' },
  { id: 3, title: 'Express CORS failure', time: 'Jun 21', score: 82, tag: 'API', severity: 'Medium' },
];

const reports = [
  { title: 'Weekly Debugging Health', type: 'PDF', status: 'Ready', owner: 'Engineering' },
  { title: 'Root Cause Trend Export', type: 'CSV', status: 'Ready', owner: 'Mentor Review' },
  { title: 'Learning Cards Pack', type: 'JSON', status: 'Draft', owner: 'Students' },
];

const securityChecks = [
  'Secrets are never stored in browser state.',
  'Prompt-injection filters run before AI calls.',
  'Rate limits protect analysis endpoints.',
  'Reports are scoped to the signed-in user.',
];

// FIX: safe array helper — prevents crashes when backend returns null/undefined
function safeArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function createFallbackBackendResponse(code, errorLog, language) {
  const isNullPointer = /nullpointer|null pointer|null/i.test(`${errorLog} ${code}`);
  return {
    success: true,
    parsedError: {
      errorType: isNullPointer ? 'Exception' : 'Runtime Error',
      keyword: isNullPointer ? 'null' : 'runtime',
      probableCause: isNullPointer ? 'Using null value before checking it' : 'Program state does not match the expected input shape',
    },
    structuredResponse: {
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
      flowchart: ['Create variable', 'Assign null', 'Call method', 'Exception occurs', 'Add null guard', 'Bug fixed'],
      quiz: [
        {
          question: 'What is the safest reason to check `name != null`?',
          options: ['To avoid calling methods on no object', 'To make Java faster', 'To create a new class', 'To stop compilation'],
          correctAnswer: 'To avoid calling methods on no object',
        },
      ],
    },
    meta: { source: 'frontend-fallback', language },
  };
}

function normalizeBackendResponse(payload, request) {
  // FIX: deep-safe extraction using safeArray to prevent crashes on any page
  const structuredResponse = payload?.structuredResponse || {};
  const parsedError = payload?.parsedError || {};
  const flashcards = safeArray(structuredResponse.flashcards).map((c) => ({
    question: c?.question || 'No question',
    answer: c?.answer || 'No answer',
  }));
  const steps = safeArray(structuredResponse.steps).map((s) => String(s));
  const flowchart = safeArray(structuredResponse.flowchart).map((f) => String(f)).filter((f) => f.trim() !== '');
  const quiz = safeArray(structuredResponse.quiz).map((q) => ({
    question: q?.question || '',
    options: safeArray(q?.options).map(String),
    correctAnswer: q?.correctAnswer || '',
  }));
  const rootCause = structuredResponse.rootCause || 'No root cause returned by the backend.';
  const title = rootCause.split(/[.!?]/)[0].slice(0, 84) || 'Bug analysis complete';

  return {
    success: payload?.success !== false,
    title,
    severity: parsedError.errorType === 'Exception' ? 'High' : 'Medium',
    confidence: payload?.meta?.confidence || 91,
    language: request.language,
    parsedError,
    structuredResponse: {
      rootCause,
      flashcards,
      steps,
      fix: structuredResponse.fix || 'No fix recommendation returned.',
      correctedCode: structuredResponse.correctedCode || '',
      flowchart,
      quiz,
    },
    source: payload?.meta?.source || 'backend',
  };
}

async function analyzeBugWithBackend(request) {
  const response = await fetch(ANALYZE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    const errors = Array.isArray(payload.errors) ? payload.errors : [payload.message || 'Bug analysis failed.'];
    const error = new Error(errors.join(', '));
    error.validationErrors = errors;
    throw error;
  }

  return normalizeBackendResponse(payload, request);
}

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
      borderColor: index === chart.length - 1 ? 'rgba(255, 224, 179, 0.72)' : index === 0 ? 'rgba(179, 219, 253, 0.62)' : 'rgba(100, 149, 237, 0.62)',
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

function App() {
  const { scrollYProgress } = useScroll();
  const auroraY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const ribbonY = useTransform(scrollYProgress, [0, 1], ['0%', '-24%']);
  const [activeView, setActiveView] = useState('overview');
  const [log, setLog] = useState(defaultLog);
  const [code, setCode] = useState(defaultCode);
  const [language, setLanguage] = useState('Java');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step, setStep] = useState(0);
  const [analysis, setAnalysis] = useState(() =>
    normalizeBackendResponse(createFallbackBackendResponse(defaultCode, defaultLog, 'Java'), { code: defaultCode, errorLog: defaultLog, language: 'Java' })
  );
  const [history, setHistory] = useState(historySeed);
  const [activeFlashcard, setActiveFlashcard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [toast, setToast] = useState('');
  // FIX: use ref for toast timer instead of attaching to function object
  const toastTimer = useRef(null);
  const flow = useMemo(() => makeFlow(analysis), [analysis]);

  const showToast = (message) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2200);
  };

  const runAnalysis = () => {
    // FIX: allow either log OR code — only block if both are empty
    if (!log.trim() && !code.trim()) {
      showToast('Add an error log or code before running analysis.');
      return;
    }
    if (!language.trim()) {
      showToast('Select a language before running analysis.');
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
            const request = { code, errorLog: log, language };
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
              next = normalizeBackendResponse(createFallbackBackendResponse(code, log, language), request);
              showToast('Backend unavailable. Showing demo-shaped response.');
            }
            setAnalysis(next);
            // FIX: reset flashcard state when new analysis arrives
            setActiveFlashcard(0);
            setFlipped(false);
            setHistory((items) => [
              // FIX: use crypto.randomUUID for stable unique IDs
              { id: crypto.randomUUID(), title: next.title, time: 'Just now', score: next.confidence, tag: next.language, severity: next.severity },
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
      <div className="workspace grid min-h-screen grid-cols-[252px_1fr] text-slate-100 max-[980px]:grid-cols-1">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <section className="min-w-0">
          <Topbar activeView={activeView} isAnalyzing={isAnalyzing} />
          <div className="px-5 py-5 max-[640px]:px-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                className="view-stack"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
              >
                {activeView === 'overview' && <OverviewView analysis={analysis} history={history} setActiveView={setActiveView} runAnalysis={runAnalysis} />}
                {activeView === 'analyze' && (
                  <AnalyzeView
                    log={log} setLog={setLog}
                    code={code} setCode={setCode}
                    language={language} setLanguage={setLanguage}
                    analysis={analysis}
                    isAnalyzing={isAnalyzing}
                    step={step}
                    onAnalyze={runAnalysis}
                    onClear={clearInputs}
                  />
                )}
                {activeView === 'workflow' && <WorkflowView analysis={analysis} flow={flow} isAnalyzing={isAnalyzing} />}
                {activeView === 'learn' && (
                  <LearnView
                    analysis={analysis}
                    activeFlashcard={activeFlashcard}
                    setActiveFlashcard={setActiveFlashcard}
                    flipped={flipped}
                    setFlipped={setFlipped}
                  />
                )}
                {activeView === 'history' && <HistoryView history={history} setHistory={setHistory} setActiveView={setActiveView} />}
                {activeView === 'reports' && <ReportsView showToast={showToast} />}
                {activeView === 'security' && <SecurityView />}
                {activeView === 'settings' && <SettingsView showToast={showToast} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="fixed bottom-5 right-5 z-30 rounded-lg border border-cyan-400/30 bg-slate-950/95 px-4 py-3 text-sm text-cyan-100 shadow-2xl shadow-cyan-950/40">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Sidebar({ activeView, setActiveView }) {
  return (
    <aside className="panel sticky top-0 z-20 h-screen border-y-0 border-l-0 p-4 max-[980px]:static max-[980px]:h-auto max-[980px]:border-r-0 max-[980px]:border-b">
      <div className="mb-6 flex items-center gap-3">
        <div className="brand-mark grid size-11 place-items-center rounded-lg shadow-lg">
          <Bot size={22} />
        </div>
        <div>
          <div className="text-sm font-semibold">AI Bug Simulator</div>
          <div className="text-xs text-slate-400">Mission Control</div>
        </div>
      </div>
      <nav className="grid gap-2 max-[980px]:grid-cols-4 max-[640px]:grid-cols-2">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            aria-label={`Navigate to ${label}`}
            onClick={() => setActiveView(id)}
            className={`flex items-center gap-3 rounded-lg border px-3 py-3 text-left text-sm transition ${
              activeView === id
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

function Topbar({ activeView, isAnalyzing }) {
  const title = navItems.find((item) => item.id === activeView)?.label || 'Overview';
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-700/50 bg-slate-950/40 px-5 py-4 backdrop-blur-xl max-[760px]:static max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-3">
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cyan-300">
          <Activity size={14} />
          AI Debugging Mission Control
        </div>
        <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-50">{title}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
        <StatusPill icon={LockKeyhole} label="Private Session" />
        <StatusPill icon={Zap} label={isAnalyzing ? 'AI Active' : 'Ready'} active={isAnalyzing} />
      </div>
    </header>
  );
}

function StatusPill({ icon: Icon, label, active }) {
  return (
    <div className={`flex items-center gap-2 rounded-full border px-3 py-2 ${active ? 'border-cyan-400/45 bg-cyan-400/10 text-cyan-200' : 'border-slate-700/70 bg-slate-900/45'}`}>
      <Icon size={15} />
      <span>{label}</span>
    </div>
  );
}

function OverviewView({ analysis, history, setActiveView, runAnalysis }) {
  return (
    <div className="grid gap-5">
      <section className="panel overflow-hidden rounded-lg p-5">
        <div className="grid grid-cols-[1fr_auto] items-center gap-5 max-[760px]:grid-cols-1">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
              <BrainCircuit size={14} />
              AI-assisted debugging workspace
            </div>
            <h2 className="max-w-3xl text-3xl font-semibold tracking-normal text-slate-50 max-[640px]:text-2xl">Turn noisy error logs into root causes, fixes, workflows, and learning cards.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">The refined interface separates each workflow into a focused page, so judges can follow the product story without a crowded dashboard.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setActiveView('analyze')} className="primary-action glow-hover inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-lg">
              <Code2 size={17} />
              Open Analyzer
            </button>
            <button onClick={runAnalysis} className="glow-hover inline-flex items-center gap-2 rounded-lg border border-cyan-400/35 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100">
              <Play size={17} />
              Run Demo
            </button>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1">
        <Metric icon={Gauge} label="Confidence" value={`${analysis.confidence}%`} tone="cyan" />
        <Metric icon={AlertTriangle} label="Severity" value={analysis.severity} tone="red" />
        <Metric icon={History} label="Analyses" value={history.length} tone="indigo" />
        <Metric icon={BookOpen} label="Learning Cards" value={analysis.structuredResponse.flashcards.length} tone="amber" />
      </div>
      <div className="grid grid-cols-[1.1fr_0.9fr] gap-5 max-[1050px]:grid-cols-1">
        <ResultSummary analysis={analysis} isAnalyzing={false} step={0} />
        <ActivityFeed history={history} />
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone }) {
  const tones = {
    cyan: 'text-cyan-200 bg-cyan-400/10 border-cyan-400/25',
    red: 'text-red-200 bg-red-500/10 border-red-400/25',
    indigo: 'text-indigo-200 bg-indigo-500/10 border-indigo-400/25',
    amber: 'text-amber-200 bg-amber-500/10 border-amber-400/25',
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

function AnalyzeView(props) {
  return (
    <div className="grid grid-cols-[minmax(360px,1fr)_430px] gap-5 max-[1180px]:grid-cols-1">
      <section className="panel rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/60 p-4">
          <div>
            <h2 className="text-base font-semibold">Incident Input</h2>
            {/* FIX: updated hint text to reflect either-or input */}
            <p className="text-sm text-slate-400">Paste an error log, code, or both — then run analysis.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={props.onClear} className="glow-hover inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300">
              <Trash2 size={16} />
              Clear
            </button>
            <button onClick={props.onAnalyze} disabled={props.isAnalyzing} className="primary-action glow-hover inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-70">
              {props.isAnalyzing ? <Loader2 className="animate-spin" size={17} /> : <Play size={17} />}
              Analyze
            </button>
          </div>
        </div>
        <div className="grid gap-4 p-4">
          <div className="grid gap-3">
            <label className="grid gap-1 text-sm text-slate-300">
              Language
              <select value={props.language} onChange={(e) => props.setLanguage(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400">
                <option value="Java">Java</option>
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Python">Python</option>
                <option value="C++">C++</option>
              </select>
            </label>
          </div>
          <label className="grid gap-2 text-sm font-medium text-slate-200">
            Error Log <span className="font-normal text-slate-400">(optional if code provided)</span>
            <textarea value={props.log} onChange={(e) => props.setLog(e.target.value)} placeholder="Paste stack trace or runtime error here..." className="h-44 resize-none rounded-lg border border-slate-700 bg-slate-950/70 p-3 font-mono text-sm leading-6 text-slate-100 outline-none focus:border-cyan-400" />
          </label>
          <div>
            <div className="mb-2 text-sm font-medium text-slate-200">
              Code <span className="font-normal text-slate-400">(optional if error log provided)</span>
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-700 bg-[#0f172a]">
              <Suspense fallback={<div className="shimmer h-[360px] p-4 text-sm text-slate-400">Loading code editor...</div>}>
                <MonacoEditor
                  height="360px"
                  language={props.language.toLowerCase() === 'c++' ? 'cpp' : props.language.toLowerCase()}
                  theme="vs-dark"
                  value={props.code}
                  // FIX: use ?? instead of || so an intentionally empty string is preserved
                  onChange={(value) => props.setCode(value ?? '')}
                  options={{ minimap: { enabled: false }, fontSize: 13, wordWrap: 'on', padding: { top: 14 }, scrollBeyondLastLine: false }}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
      <aside className="grid gap-5">
        <ResultSummary analysis={props.analysis} isAnalyzing={props.isAnalyzing} step={props.step} />
        <ConfidenceMeter score={props.analysis.confidence} isAnalyzing={props.isAnalyzing} />
      </aside>
    </div>
  );
}

function WorkflowView({ analysis, flow, isAnalyzing }) {
  const { steps, correctedCode } = analysis.structuredResponse;
  // FIX: guard against empty steps array to avoid blank page
  const safeSteps = steps.length > 0 ? steps : ['No steps available — run an analysis first.'];
  return (
    <div className="grid gap-5">
      <FlowPanel flow={flow} isAnalyzing={isAnalyzing} />
      <div className="grid grid-cols-[1fr_0.9fr] gap-5 max-[980px]:grid-cols-1">
        <Insights analysis={analysis} />
        <section className="panel rounded-lg p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><RotateCcw size={16} /> Bug Story Timeline</div>
          <ol className="grid gap-3 text-sm text-slate-300">
            {safeSteps.map((item, i) => (
              <li key={i} className="card flex gap-2 p-3">
                <ChevronRight className="mt-0.5 shrink-0 text-cyan-300" size={15} />{item}
              </li>
            ))}
          </ol>
        </section>
      </div>
      <CodeBlock title="Corrected Code" code={correctedCode} />
    </div>
  );
}

function LearnView({ analysis, activeFlashcard, setActiveFlashcard, flipped, setFlipped }) {
  const { flashcards, quiz } = analysis.structuredResponse;
  // FIX: guard against empty flashcards array
  const safeFlashcards = flashcards.length > 0 ? flashcards : [{ question: 'No flashcard available', answer: 'Run an analysis to generate learning cards.' }];
  const safeQuiz = quiz.length > 0 ? quiz : [];
  const currentCard = safeFlashcards[Math.min(activeFlashcard, safeFlashcards.length - 1)];

  return (
    <div className="grid grid-cols-[1fr_0.85fr] gap-5 max-[980px]:grid-cols-1">
      <section className="panel rounded-lg p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Flashcard Insight</h2>
            <p className="text-sm text-slate-400">Flip the card to reinforce debugging concepts.</p>
          </div>
          <button onClick={() => setFlipped((v) => !v)} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-cyan-400 hover:text-cyan-200">Flip</button>
        </div>
        <button onClick={() => setFlipped((v) => !v)} className="relative h-64 w-full text-left [perspective:1000px]">
          <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.45 }} className="relative h-full w-full [transform-style:preserve-3d]">
            <div className="card absolute inset-0 grid content-center p-6 [backface-visibility:hidden]">
              <div className="text-xs uppercase text-cyan-300">Question</div>
              <p className="mt-3 text-xl font-semibold leading-8">{currentCard.question}</p>
            </div>
            <div className="card absolute inset-0 grid content-center p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="text-xs uppercase text-emerald-300">Answer</div>
              <p className="mt-3 text-lg leading-8 text-slate-300">{currentCard.answer}</p>
            </div>
          </motion.div>
        </button>
        <div className="mt-4 flex gap-2">
          {safeFlashcards.map((card, index) => (
            <button
              key={index}
              // FIX: reset flip state when switching cards
              onClick={() => { setActiveFlashcard(index); setFlipped(false); }}
              className={`h-2 flex-1 rounded-full ${activeFlashcard === index ? 'bg-cyan-300' : 'bg-slate-700'}`}
              title={`Card ${index + 1}`}
            />
          ))}
        </div>
      </section>
      <section className="panel rounded-lg p-5">
        <h2 className="mb-3 text-lg font-semibold">Quiz</h2>
        {safeQuiz.length === 0 ? (
          <EmptyState title="No quiz available" body="Run an analysis to generate quiz questions." />
        ) : (
          <div className="grid gap-4">
            {safeQuiz.map((item, i) => (
              <div key={i} className="card p-4">
                <p className="font-medium">{item.question}</p>
                <div className="mt-3 grid gap-2">
                  {item.options.map((option) => (
                    <div key={option} className={`rounded-lg border px-3 py-2 text-sm ${option === item.correctAnswer ? 'border-emerald-400/35 bg-emerald-400/10 text-emerald-100' : 'border-slate-700 bg-slate-950/30 text-slate-300'}`}>
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
  );
}

function HistoryView({ history, setHistory, setActiveView }) {
  const [query, setQuery] = useState('');
  const filtered = history.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.tag.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <section className="panel rounded-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/60 p-4">
        <div>
          <h2 className="text-lg font-semibold">Analysis History</h2>
          <p className="text-sm text-slate-400">Search recent investigations and reopen the analyzer.</p>
        </div>
        <label className="flex min-w-[260px] items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-300">
          <Search size={16} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search history..." className="w-full bg-transparent outline-none" />
        </label>
      </div>
      <div className="grid gap-3 p-4">
        {filtered.length === 0 ? (
          <EmptyState title="No matching analyses" body="Try a different search term or run a new analysis." />
        ) : filtered.map((item) => (
          <div key={item.id} className="card glow-hover grid grid-cols-[1fr_auto_auto] items-center gap-3 p-4 max-[720px]:grid-cols-1">
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="mt-1 text-sm text-slate-400">{item.tag} · {item.time}</div>
            </div>
            <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-sm font-semibold text-indigo-200">{item.score}%</span>
            <button onClick={() => setActiveView('analyze')} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-cyan-400 hover:text-cyan-200">Open</button>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-700/60 p-4">
        <button onClick={() => setHistory([])} className="inline-flex items-center gap-2 rounded-lg border border-red-400/25 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          <Trash2 size={16} />
          Clear History
        </button>
      </div>
    </section>
  );
}

function ReportsView({ showToast }) {
  return (
    <div className="grid gap-5">
      <section className="panel rounded-lg p-5">
        <h2 className="text-lg font-semibold">Saved Reports</h2>
        <p className="mt-1 text-sm text-slate-400">Exportable artifacts for demos, mentor review, and team handoff.</p>
      </section>
      <div className="grid grid-cols-3 gap-4 max-[980px]:grid-cols-1">
        {reports.map((report) => (
          <div key={report.title} className="card glow-hover p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">{report.type}</span>
              <span className="text-xs text-slate-400">{report.status}</span>
            </div>
            <h3 className="font-semibold">{report.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{report.owner}</p>
            <button onClick={() => showToast(`${report.title} export queued.`)} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-cyan-400 hover:text-cyan-200">
              <Download size={16} />
              Export
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecurityView() {
  return (
    <div className="grid grid-cols-[0.9fr_1.1fr] gap-5 max-[980px]:grid-cols-1">
      <section className="panel rounded-lg p-5">
        <div className="mb-4 grid size-12 place-items-center rounded-lg border border-emerald-400/25 bg-emerald-400/10 text-emerald-200">
          <ShieldCheck size={22} />
        </div>
        <h2 className="text-lg font-semibold">Security Posture</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">This frontend is demo-ready and designed around safe API integration. Real AI keys should stay on the backend only.</p>
      </section>
      <section className="panel rounded-lg p-5">
        <h2 className="mb-4 text-lg font-semibold">Controls</h2>
        <div className="grid gap-3">
          {securityChecks.map((check) => (
            <div key={check} className="card flex items-center gap-3 p-3 text-sm text-slate-300">
              <CheckCircle2 size={17} className="text-emerald-300" />
              {check}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SettingsView({ showToast }) {
  const [model, setModel] = useState('gpt-4.1-mini');
  const [streaming, setStreaming] = useState(true);
  return (
    <section className="panel rounded-lg p-5">
      <h2 className="text-lg font-semibold">Workspace Settings</h2>
      <div className="mt-5 grid max-w-2xl gap-5">
        <label className="grid gap-2 text-sm text-slate-300">
          AI Model
          <select value={model} onChange={(e) => setModel(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400">
            <option value="gpt-4.1-mini">GPT-4.1 Mini</option>
            <option value="gemini-flash">Gemini Flash</option>
            <option value="mock-demo">Mock Demo Engine</option>
          </select>
        </label>
        <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-700 bg-slate-950/40 p-4 text-sm text-slate-300">
          <span>
            <span className="block font-medium text-slate-100">Streaming AI status</span>
            <span className="text-slate-400">Show parsing and root-cause steps during analysis.</span>
          </span>
          <input type="checkbox" checked={streaming} onChange={(e) => setStreaming(e.target.checked)} className="size-5 accent-cyan-400" />
        </label>
        <button onClick={() => showToast(`Settings saved for ${model}.`)} className="primary-action w-fit rounded-lg px-4 py-2 text-sm font-semibold text-white">Save Settings</button>
      </div>
    </section>
  );
}

function ResultSummary({ analysis, isAnalyzing, step }) {
  const { rootCause } = analysis.structuredResponse;
  return (
    <section className="panel rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-cyan-200">
          <BrainCircuit size={18} />
          AI Analysis Panel
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${analysis.severity === 'High' ? 'bg-red-500/15 text-red-200' : 'bg-amber-500/15 text-amber-200'}`}>{analysis.severity}</span>
      </div>
      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-3">
            {thinkingSteps.map((item, index) => (
              <div key={item} className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${index <= step ? 'border-cyan-400/35 bg-cyan-400/10 text-cyan-100' : 'border-slate-700/50 bg-slate-900/40 text-slate-500'}`}>
                {index < step ? <CheckCircle2 size={17} /> : index === step ? <Loader2 className="animate-spin" size={17} /> : <Clock3 size={17} />}
                {item}
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-3">
            <h2 className="text-xl font-semibold">{analysis.title}</h2>
            <p className="text-sm leading-6 text-slate-300">Backend field: <span className="text-cyan-200">structuredResponse.rootCause</span></p>
            <div className="card p-3">
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-100"><AlertTriangle size={16} /> Probable Root Cause</div>
              <p className="text-sm leading-6 text-slate-300">{rootCause}</p>
            </div>
            {analysis.parsedError?.errorType && (
              <div className="grid grid-cols-3 gap-2 text-xs text-slate-300 max-[620px]:grid-cols-1">
                <div className="card p-2"><span className="text-slate-500">Type</span><br />{analysis.parsedError.errorType}</div>
                <div className="card p-2"><span className="text-slate-500">Keyword</span><br />{analysis.parsedError.keyword || 'N/A'}</div>
                <div className="card p-2"><span className="text-slate-500">Cause</span><br />{analysis.parsedError.probableCause || 'N/A'}</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ConfidenceMeter({ score, isAnalyzing }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;
  return (
    <section className="panel grid place-items-center rounded-lg p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Gauge size={17} /> Confidence</div>
      <div className="relative size-32">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90">
          <circle cx="60" cy="60" r={radius} stroke="rgba(148,163,184,0.18)" strokeWidth="10" fill="none" />
          <motion.circle cx="60" cy="60" r={radius} stroke="url(#confidenceGradient)" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={circumference} animate={{ strokeDashoffset: isAnalyzing ? circumference * 0.35 : progress }} transition={{ duration: 0.8 }} />
          <defs>
            <linearGradient id="confidenceGradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#b3dbfd" />
              <stop offset="100%" stopColor="#6495ed" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 grid place-items-center text-3xl font-bold">{isAnalyzing ? '...' : `${score}%`}</div>
      </div>
    </section>
  );
}

function FlowPanel({ flow, isAnalyzing }) {
  return (
    <section className="panel min-h-[480px] overflow-hidden rounded-lg">
      <div className="flex items-center justify-between border-b border-slate-700/60 p-4 max-[640px]:items-start max-[640px]:gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold"><Layers3 size={17} /> Debugging Workflow</div>
        <span className="text-xs text-slate-400">Progressive cause-to-fix map</span>
      </div>
      <div className="h-[430px]">
        <ReactFlow nodes={isAnalyzing ? flow.nodes.slice(0, 3) : flow.nodes} edges={isAnalyzing ? flow.edges.slice(0, 2) : flow.edges} fitView proOptions={{ hideAttribution: true }}>
          <Background color="#334155" gap={18} size={1} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </section>
  );
}

function Insights({ analysis }) {
  const { fix } = analysis.structuredResponse;
  return (
    <section className="panel overflow-hidden rounded-lg">
      <div className="border-b border-slate-700/60 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold"><Sparkles size={17} /> Fix Explanation</div>
      </div>
      <div className="grid gap-3 p-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card glow-hover p-4">
          <p className="text-sm leading-7 text-slate-300">{fix}</p>
        </motion.div>
      </div>
    </section>
  );
}

function CodeBlock({ title, code }) {
  const [copied, setCopied] = useState(false);
  const copyCode = async () => {
    await navigator.clipboard.writeText(code || '');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return (
    <section className="panel overflow-hidden rounded-lg">
      <div className="flex items-center justify-between border-b border-slate-700/60 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold"><Code2 size={17} /> {title}</div>
        <button onClick={copyCode} className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:border-cyan-400 hover:text-cyan-200">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-auto bg-slate-950/70 p-4 text-sm leading-7 text-slate-100"><code>{code || '// No corrected code returned yet.'}</code></pre>
    </section>
  );
}

function ActivityFeed({ history }) {
  return (
    <section className="panel rounded-lg p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold"><FileClock size={17} /> Live Activity</div>
      <div className="grid gap-3">
        {history.slice(0, 4).map((item) => (
          <div key={item.id} className="card flex items-center justify-between gap-3 p-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{item.title}</div>
              <div className="mt-1 text-xs text-slate-400">{item.tag} · {item.time}</div>
            </div>
            <span className="rounded-full bg-indigo-500/15 px-2 py-1 text-xs font-semibold text-indigo-200">{item.score}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function EmptyState({ title, body }) {
  return (
    <div className="grid place-items-center rounded-lg border border-dashed border-slate-700 p-10 text-center">
      <BarChart3 className="mb-3 text-slate-500" size={28} />
      <div className="font-semibold">{title}</div>
      <p className="mt-1 max-w-sm text-sm text-slate-400">{body}</p>
    </div>
  );
}

export default App;