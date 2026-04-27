import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import MetricsDashboard from './components/MetricsDashboard.tsx';
import CaseStudy from './components/CaseStudy.tsx';
import ChatWorkspace from './components/ChatWorkspace.tsx';
import AgentCatalog from './components/AgentCatalog.tsx';
import Pricing from './components/Pricing.tsx';
import Settings from './components/Settings.tsx';
import Changelog from './components/Changelog.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/workspace" element={<ChatWorkspace />} />
        <Route path="/agents" element={<AgentCatalog />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/case-study" element={<CaseStudy />} />
        <Route path="/metrics" element={<MetricsDashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
