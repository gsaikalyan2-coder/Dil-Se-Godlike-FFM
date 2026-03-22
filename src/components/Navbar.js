import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getLiveMatch } from '../data/store';
import { useLiveTournament } from '../hooks/useTournamentStoreSync';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/live', label: 'Live Scores' },
  { to: '/roster', label: 'Roster' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/history', label: 'History' },
  { to: '/tournaments', label: 'Tournaments' },
  { to: '/admin', label: 'Admin' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const live = getLiveMatch();
  const liveTournament = useLiveTournament();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFB800] border-b border-[#E6A600]">
      {/* Logo - absolute top-left corner of screen */}
      <Link to="/" className="absolute top-0 left-0 sm:left-4 z-[60] flex items-center h-16 transition-opacity hover:opacity-80">
        <img 
          src="/images/images (2).png" 
          alt="GodLike FFM Logo" 
          className="w-[190px] sm:w-[200px] h-full object-contain object-left drop-shadow-sm scale-110 sm:scale-[1.3] origin-left"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </Link>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16 relative">
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all no-underline ${
                  location.pathname === link.to
                    ? 'text-white bg-black'
                    : 'text-black hover:bg-black/10 hover:text-black'
                }`}
              >
                {link.label}
                {link.to === '/live' && live && (
                  <span className="ml-1.5 inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse-live" />
                )}
                {link.to === '/' && liveTournament && (
                  <span className="ml-1.5 inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse-live" />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden absolute right-0 text-black p-2 rounded-md hover:bg-black/10 transition"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#E6A600] bg-[#FFB800]">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-bold no-underline ${
                  location.pathname === link.to
                    ? 'text-white bg-black'
                    : 'text-black hover:bg-black/10 hover:text-black'
                }`}
              >
                {link.label}
                {link.to === '/live' && live && (
                  <span className="ml-1.5 inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse-live" />
                )}
                {link.to === '/' && liveTournament && (
                  <span className="ml-1.5 inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse-live" />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
