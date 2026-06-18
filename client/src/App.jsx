import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Workspace from "./pages/Workspace";
import AIAnalysis from "./pages/AIAnalysis";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Team from "./pages/Team";
import Playground from "./pages/Playground";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-zinc-950">
        <Sidebar />

        <div className="flex-1">
          <Header />

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/analysis" element={<AIAnalysis />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/team" element={<Team />} />
            <Route path="/playground" element={<Playground />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;