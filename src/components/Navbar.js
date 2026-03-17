import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getLiveMatch } from '../data/store';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/live', label: 'Live Scores' },
  { to: '/roster', label: 'Roster' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/history', label: 'History' },
  { to: '/admin', label: 'Admin' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const live = getLiveMatch();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-sm border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-heading font-bold text-sm">GL</span>
            </div>
            <span className="font-heading font-bold text-xl text-white">
              GODLIKE <span className="text-accent">FFM</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors no-underline ${
                  location.pathname === link.to
                    ? 'text-accent bg-accent/10'
                    : 'text-grey-light hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
                {link.to === '/live' && live && (
                  <span className="ml-1.5 inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse-live" />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white p-2 rounded-md hover:bg-white/10 transition"
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
        <div className="md:hidden border-t border-dark-border bg-dark/95 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium no-underline ${
                  location.pathname === link.to
                    ? 'text-accent bg-accent/10'
                    : 'text-grey-light hover:text-white'
                }`}
              >
                {link.label}
                {link.to === '/live' && live && (
                  <span className="ml-1.5 inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse-live" />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
