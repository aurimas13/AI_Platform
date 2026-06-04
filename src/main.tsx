import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

const MetricsDashboard = lazy(() => import('./components/MetricsDashboard.tsx'));
const CaseStudy = lazy(() => import('./components/CaseStudy.tsx'));
const ChatWorkspace = lazy(() => import('./components/ChatWorkspace.tsx'));
const AgentCatalog = lazy(() => import('./components/AgentCatalog.tsx'));
const Pricing = lazy(() => import('./components/Pricing.tsx'));
const Settings = lazy(() => import('./components/Settings.tsx'));
const Changelog = lazy(() => import('./components/Changelog.tsx'));
const NotFound = lazy(() => import('./components/NotFound.tsx'));

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" aria-busy="true">
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone inline-flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 rounded-full bg-brass-bright animate-ping opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brass-bright" />
        </span>
        Composing
      </span>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/workspace" element={<ChatWorkspace />} />
          <Route path="/agents" element={<AgentCatalog />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/case-study" element={<CaseStudy />} />
          <Route path="/metrics" element={<MetricsDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>
);
