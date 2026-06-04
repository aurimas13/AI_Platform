import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import TopNav from './TopNav';

export default function NotFound() {
  return (
    <div className="min-h-screen text-ink flex flex-col">
      <TopNav />

      <div className="border-b border-rule/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-stone">
          <span>AI Gateway · Errata</span>
          <span className="hidden sm:inline">page not found</span>
          <span>404</span>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-8 py-20 sm:py-28 flex flex-col items-center text-center">
        <p className="silcrow mb-7">§ Errata · folio missing</p>
        <h1
          className="font-display text-[3.4rem] sm:text-[5rem] font-medium leading-[0.95] tracking-[-0.03em] text-ink mb-6"
          style={{ fontVariationSettings: '"SOFT" 60, "opsz" 110' }}
        >
          This page is{' '}
          <em
            className="italic font-normal text-brass"
            style={{ fontVariationSettings: '"SOFT" 100, "opsz" 110' }}
          >
            unwritten
          </em>
          <span className="text-brass-bright">.</span>
        </h1>
        <p className="font-sans text-base sm:text-lg text-stone leading-relaxed max-w-md mb-10">
          The folio you're looking for isn't in this volume. It may have been moved,
          renamed, or never set to print.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/" className="btn-ink">
            Back to the start
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/agents" className="btn-ghost">
            Browse the agents
          </Link>
        </div>

        <p className="marginalia mt-10">
          <a
            href="https://aurimas.io"
            className="inline-flex items-center gap-1.5 hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            aurimas.io
          </a>
        </p>
      </main>

      <footer className="border-t border-rule/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-7 marginalia text-center">
          © MMXXVI · AI Gateway · An atelier of agents
        </div>
      </footer>
    </div>
  );
}
