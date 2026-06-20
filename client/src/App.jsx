import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Workspace from "./pages/Workspace";
import AIAnalysis from "./pages/AIAnalysis";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Playground from "./pages/Playground";

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <div className="flex-1">
        <Header />
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages - no sidebar */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />

        {/* App pages - with sidebar */}
        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/workspace" element={<AppLayout><Workspace /></AppLayout>} />
        <Route path="/analysis" element={<AppLayout><AIAnalysis /></AppLayout>} />
        <Route path="/reports" element={<AppLayout><Reports /></AppLayout>} />
        <Route path="/analytics" element={<AppLayout><Analytics /></AppLayout>} />
        <Route path="/playground" element={<AppLayout><Playground /></AppLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;