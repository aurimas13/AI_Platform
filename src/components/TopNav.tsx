import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface TopNavProps {
  variant?: 'default' | 'workspace';
}

const navLinks = [
  { to: '/workspace', label: 'Workspace', num: '01' },
  { to: '/agents', label: 'Agents', num: '02' },
  { to: '/pricing', label: 'Pricing', num: '03' },
  { to: '/changelog', label: 'Changelog', num: '04' },
  { to: '/case-study', label: 'Case Study', num: '05' },
];

/**
 * Editorial masthead. Hairline gold rule below, Fraunces wordmark with
 * brass-foil hex glyph, mono uppercase nav labels with index numbers.
 */
export default function TopNav({ variant = 'default' }: TopNavProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isWorkspace = variant === 'workspace';
  const headerBg = isWorkspace
    ? 'bg-void/85 border-b border-void-elev/60'
    : 'bg-paper/80 border-b border-rule/60';

  return (
    <header
      className={`relative z-40 sticky top-0 backdrop-blur-md ${headerBg}`}
    >
      <div className="flex items-center justify-between gap-3 px-4 sm:px-8 py-3 sm:py-3.5">
        {/* Left — wordmark cluster */}
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <a
            href="https://aurimas.io"
            className={`hidden sm:flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.18em] transition-colors whitespace-nowrap ${
              isWorkspace ? 'text-bone-soft hover:text-bone' : 'text-stone hover:text-ink'
            }`}
          >
            <ArrowLeft className="w-3 h-3" />
            aurimas.io
          </a>
          <span className={`hidden sm:block w-px h-4 ${isWorkspace ? 'bg-void-elev' : 'bg-rule/70'}`} />

          <Link to="/workspace" className="flex items-center gap-2.5 min-w-0 group">
            {/* Hex monogram in brass foil */}
            <svg
              viewBox="0 0 32 32"
              className="w-7 h-7 flex-shrink-0 transition-transform group-hover:rotate-[60deg] duration-700 ease-out"
              aria-hidden
            >
              <defs>
                <linearGradient id="hex-foil" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#E8CD8B" />
                  <stop offset="1" stopColor="#9C6A1F" />
                </linearGradient>
              </defs>
              <polygon
                points="16,2 28,9 28,23 16,30 4,23 4,9"
                fill="url(#hex-foil)"
              />
              <polygon
                points="16,7 24,11.5 24,20.5 16,25 8,20.5 8,11.5"
                fill="none"
                stroke={isWorkspace ? '#1F1A14' : '#1C1714'}
                strokeOpacity="0.15"
                strokeWidth="0.6"
              />
            </svg>
            <span className="flex flex-col leading-none min-w-0">
              <span
                className={`font-display text-[1.05rem] sm:text-[1.15rem] font-semibold tracking-tight truncate ${
                  isWorkspace ? 'text-bone' : 'text-ink'
                }`}
                style={{ fontVariationSettings: '"SOFT" 30, "opsz" 14' }}
              >
                AI Gateway
              </span>
              <span
                className={`font-mono text-[9px] uppercase tracking-[0.22em] mt-0.5 ${
                  isWorkspace ? 'text-brass-bright/70' : 'text-brass'
                }`}
              >
                Atelier · MMXXVI
              </span>
            </span>
          </Link>
        </div>

        {/* Center / Right — nav */}
        <nav className="hidden md:flex items-center">
          {navLinks.map((link, i) => {
            const active =
              location.pathname === link.to ||
              (link.to === '/workspace' && location.pathname.startsWith('/workspace'));
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative group px-3 py-1 inline-flex items-baseline gap-1.5 transition-colors ${
                  isWorkspace
                    ? active
                      ? 'text-bone'
                      : 'text-bone-soft hover:text-bone'
                    : active
                      ? 'text-ink'
                      : 'text-stone hover:text-ink'
                }`}
              >
                <span
                  className={`font-mono text-[10px] tabular-nums tracking-widest ${
                    active ? 'text-brass-bright' : 'text-stone-mute'
                  }`}
                >
                  {link.num}
                </span>
                <span className="font-sans text-[13px] font-medium tracking-tight">
                  {link.label}
                </span>
                {/* Hairline brass underline on active */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute left-3 right-3 -bottom-0.5 h-px transition-all ${
                    active
                      ? 'bg-brass-bright opacity-100 scale-x-100'
                      : 'bg-brass-bright opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100'
                  } origin-left duration-300`}
                />
                {/* Section divider — vertical hairline between items */}
                {i < navLinks.length - 1 && (
                  <span
                    aria-hidden
                    className={`absolute -right-px top-1/2 -translate-y-1/2 h-3 w-px ${
                      isWorkspace ? 'bg-void-elev' : 'bg-rule/50'
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/settings"
            className={`hidden sm:flex w-9 h-9 items-center justify-center transition-all border ${
              isWorkspace
                ? 'border-void-elev hover:border-brass-bright bg-void-soft text-bone'
                : 'border-rule hover:border-brass bg-paper-light text-ink hover:bg-brass-tint/50'
            }`}
            aria-label="Settings"
          >
            <span className="font-mono text-[11px] font-semibold">A</span>
          </Link>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className={`md:hidden w-9 h-9 flex items-center justify-center border transition-colors ${
              isWorkspace
                ? 'border-void-elev bg-void-soft text-bone hover:border-brass-bright'
                : 'border-rule bg-paper-light text-ink hover:border-brass'
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className={`md:hidden absolute top-full left-0 right-0 backdrop-blur-md border-b shadow-press-hover ${
            isWorkspace
              ? 'bg-void/95 border-void-elev'
              : 'bg-paper-light/95 border-rule'
          }`}
        >
          <nav className="flex flex-col px-3 py-3 gap-px">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-baseline gap-3 px-4 py-3 transition-colors ${
                    isWorkspace
                      ? active
                        ? 'bg-brass-deep/30 text-bone'
                        : 'text-bone-soft hover:text-bone hover:bg-void-soft'
                      : active
                        ? 'bg-brass-tint/60 text-ink'
                        : 'text-stone hover:text-ink hover:bg-paper'
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] tabular-nums tracking-widest ${
                      active ? 'text-brass-bright' : 'text-stone-mute'
                    }`}
                  >
                    {link.num}
                  </span>
                  <span className="font-sans text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}
            <Link
              to="/settings"
              onClick={() => setMobileOpen(false)}
              className={`flex items-baseline gap-3 px-4 py-3 transition-colors ${
                isWorkspace
                  ? 'text-bone-soft hover:text-bone hover:bg-void-soft'
                  : 'text-stone hover:text-ink hover:bg-paper'
              }`}
            >
              <span className="font-mono text-[10px] tabular-nums tracking-widest text-stone-mute">
                06
              </span>
              <span className="font-sans text-sm font-medium">Settings</span>
            </Link>
          </nav>
        </div>
      )}

      {/* Hairline gold rule beneath the masthead */}
      <div className={`absolute bottom-0 left-0 right-0 h-px ${isWorkspace ? 'bg-brass-deep/40' : 'bg-rule/70'}`} />
    </header>
  );
}
