import { Link, useLocation } from 'react-router-dom';
import { Hexagon, ArrowLeft, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface TopNavProps {
  variant?: 'default' | 'workspace';
}

const navLinks = [
  { to: '/workspace', label: 'Workspace' },
  { to: '/agents', label: 'Agents' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/changelog', label: 'Changelog' },
  { to: '/case-study', label: 'Case Study' },
];

export default function TopNav({ variant = 'default' }: TopNavProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={`flex items-center justify-between gap-3 px-4 sm:px-8 py-3 sm:py-4 border-b border-stone-200/60 bg-cream-100/85 backdrop-blur-md sticky top-0 z-40 ${
        variant === 'workspace' ? 'h-14' : ''
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-6 min-w-0">
        <a
          href="https://aurimas.io"
          className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-500 hover:text-stone-900 transition-colors whitespace-nowrap"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">aurimas.io</span>
        </a>
        <div className="hidden sm:block w-px h-4 bg-stone-300" />
        <Link to="/workspace" className="flex items-center gap-2 min-w-0">
          <Hexagon
            className="w-6 h-6 sm:w-7 sm:h-7 text-brass-600 flex-shrink-0"
            strokeWidth={1.75}
          />
          <span className="text-base sm:text-lg font-semibold tracking-tight truncate">
            AI Gateway
          </span>
        </Link>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => {
          const active =
            location.pathname === link.to ||
            (link.to === '/workspace' && location.pathname.startsWith('/workspace'));
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                active
                  ? 'bg-stone-900 text-cream-50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <Link
          to="/settings"
          className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg bg-white border border-stone-200 hover:border-stone-300 hover:shadow-card transition-all"
          aria-label="Settings"
        >
          <span className="text-xs font-bold text-stone-700">A</span>
        </Link>
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-stone-200 hover:border-stone-300 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-cream-100 border-b border-stone-200 shadow-card-lg">
          <nav className="flex flex-col p-3 gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? 'bg-stone-900 text-cream-50'
                      : 'text-stone-700 hover:bg-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/settings"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-2.5 text-sm font-medium rounded-lg text-stone-700 hover:bg-white transition-colors"
            >
              Settings
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
