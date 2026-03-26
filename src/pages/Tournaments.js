import React from 'react';
import CompletedTournaments from '../components/CompletedTournaments';
import DynamicCompletedTournaments from '../components/DynamicCompletedTournaments';

export default function Tournaments() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#0a0a0a] text-[#e5e2e1] font-body relative overflow-hidden">
      {/* Brutalist Grid Background overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#e6c364 1px, transparent 1px), linear-gradient(90deg, #e6c364 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Dynamic Legacy Header */}
        <div className="mb-20 animate-slide-up">
          <span className="font-label text-[#e6c364] tracking-[0.4em] text-xs font-bold uppercase mb-4 block">Legacy</span>
          <h1 className="font-headline font-black text-6xl sm:text-7xl lg:text-8xl text-white uppercase tracking-tighter leading-none shadow-sm mb-8">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6c364] to-[#c9a84c]">Archive</span>
          </h1>
          <p className="max-w-xl text-white/60 font-body text-sm leading-relaxed border-l-2 border-[#e6c364]/40 pl-5">
            A comprehensive vault of competitive history. Every championship, every kill, every Booyah. The Sovereign Arena immortalizes GodLike's absolute dominance in Free Fire esports.
          </p>
        </div>

        {/* Global Lifetime Performance Bento (Visual/Aesthetic Data Override) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-24">
          {[
            { label: 'Championships', value: '18+' },
            { label: 'Total Booyahs', value: '250+' },
            { label: 'Squad Kills', value: '4,500+' },
            { label: 'Win Rate', value: '68%' }
          ].map((stat, i) => (
             <div 
               key={i} 
               className="group relative bg-[#13110e]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:border-[#e6c364]/40 hover:bg-[#1a1710]/90 transition-all duration-500 hover:-translate-y-2 animate-slide-up"
               style={{ animationDelay: `${i * 100}ms` }}
             >
                {/* Glow behind the statistic */}
                <div className="absolute inset-0 bg-[#e6c364]/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
                
                <span className="block font-label text-[#e6c364]/70 uppercase tracking-widest text-[10px] mb-2 relative z-10">{stat.label}</span>
                <span className="block font-headline font-black text-4xl lg:text-5xl text-white group-hover:text-[#e6c364] transition-colors relative z-10">{stat.value}</span>
             </div>
          ))}
        </div>
        
        {/* Content Flow */}
        <div className="space-y-24">
           {/* Admin-ended tournaments */}
           <div className="relative">
              <div className="absolute -left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-[#e6c364] to-transparent opacity-20 hidden lg:block rounded-full"></div>
              <DynamicCompletedTournaments />
           </div>
           
           {/* Hardcoded Archival tournaments */}
           <div className="relative">
              <div className="flex items-center gap-6 mb-16">
                 <div className="h-px bg-white/5 flex-1 shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>
                 <span className="font-headline font-black text-white/20 tracking-[0.3em] uppercase text-xl">Historical Library</span>
                 <div className="h-px bg-white/5 flex-1 shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>
              </div>
              <CompletedTournaments />
           </div>
        </div>

      </div>
    </div>
  );
}
