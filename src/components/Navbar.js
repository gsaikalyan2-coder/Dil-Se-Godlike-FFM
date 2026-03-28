import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLiveTournament } from '../hooks/useTournamentStoreSync';

const navLinks = [
  { to: '/', label: 'Overview' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/roster', label: 'Teams' },
  { to: '/tournaments', label: 'History' },
  { to: '/heartbreak', label: 'Heartbreak' },
  { to: '/admin', label: 'Admin' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const liveTournament = useLiveTournament();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled 
          ? 'bg-[#0a0a09]/90 backdrop-blur-2xl border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-0' 
          : 'bg-transparent border-transparent py-2'
      }`}
    >
      {/* Brutalist Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#e6c364]/30 to-transparent" />

      {/* Logo - Absolute positioning to hover over content */}
      <Link to="/" className="absolute top-0 left-4 sm:left-8 z-[60] flex items-center h-16 sm:h-20 transition-transform duration-500 hover:scale-105 origin-left">
        <img 
          src="/images/NewGodLLogo.png"
          alt="GodLike FFM Logo" 
          className="w-[160px] sm:w-[220px] h-full object-contain object-left drop-shadow-2xl brightness-110 contrast-125"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </Link>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16 sm:h-20 relative">
          
          {/* Desktop Glassmorphic Pill Tab Bar */}
          <div className="hidden md:block">
            <div className="bg-[#111113]/80 backdrop-blur-md rounded-full p-1.5 flex items-center border border-white/5 shadow-inner">
              {navLinks.map(link => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-6 py-2 rounded-full font-headline font-bold text-xs uppercase tracking-[0.15em] transition-all duration-300 whitespace-nowrap overflow-hidden group ${
                      isActive
                        ? 'text-[#0a0a0a]'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 bg-gradient-to-r from-[#e6c364] to-[#c9a84c] rounded-full shadow-[0_0_15px_rgba(230,195,100,0.4)]" />
                    )}
                    <span className="relative z-10 flex items-center">
                      {link.label}
                      {link.to === '/' && liveTournament && (
                        <span className={`ml-2 inline-block w-2 h-2 rounded-full animate-ping ${isActive ? 'bg-red-600' : 'bg-red-500'}`} />
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden absolute right-0 text-[#e6c364] p-2 rounded-md hover:bg-white/5 transition border border-transparent hover:border-white/10"
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

      {/* Mobile Menu Panel (Glassmorphic Slide-Down) */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${open ? 'max-h-96 opacity-100 border-t border-white/5 bg-[#0a0a09]/95 backdrop-blur-3xl' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-4 space-y-2">
          {navLinks.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-xl font-headline font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-gradient-to-r from-[#e6c364]/10 to-transparent text-[#e6c364] border-l-2 border-[#e6c364]'
                    : 'text-white/60 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                }`}
              >
                <span>{link.label}</span>
                {link.to === '/' && liveTournament && (
                  <span className="inline-block w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
