import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { fetchCandleCount, lightCandle, hasLitLocally } from '../lib/supabaseCandles';

/* ═══ Ember Particle Component ═══ */
function EmberParticles({ active }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.02; // float upward
        p.life -= 1;
        p.size *= 0.995;
        const alpha = Math.min(1, p.life / 40);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grd.addColorStop(0, `rgba(230,195,100,${alpha})`);
        grd.addColorStop(0.6, `rgba(201,168,76,${alpha * 0.5})`);
        grd.addColorStop(1, `rgba(230,195,100,0)`);
        ctx.fillStyle = grd;
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Burst embers when activated
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.6;
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 2.5;
      particlesRef.current.push({
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed * 0.4,
        vy: -Math.abs(Math.sin(angle) * speed) - 0.5,
        size: 1.5 + Math.random() * 3,
        life: 60 + Math.random() * 80,
      });
    }
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-30"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

/* ═══ Animated Counter ═══ */
function AnimatedCount({ value }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef(null);

  useEffect(() => {
    const start = display;
    const diff = value - start;
    if (diff === 0) return;
    const duration = 600;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

const Heartbreak = () => {
  const [candleCount, setCandleCount] = useState(0);
  const [hasLit, setHasLit] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [emberBurst, setEmberBurst] = useState(0); // increment to trigger burst
  const [lighting, setLighting] = useState(false); // animation state
  const [glowPulse, setGlowPulse] = useState(false);

  // Load initial state
  useEffect(() => {
    setMounted(true);
    setHasLit(hasLitLocally());
    fetchCandleCount().then(c => setCandleCount(c));

    // Real-time subscription for candle inserts
    const channel = supabase
      .channel('candles-rt')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'candles' }, () => {
        fetchCandleCount().then(c => setCandleCount(c));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleLightCandle = useCallback(async () => {
    if (hasLit || lighting) return;
    setLighting(true);
    setGlowPulse(true);

    const newCount = await lightCandle();
    if (newCount !== null) {
      setCandleCount(newCount);
      setHasLit(true);
      setEmberBurst(prev => prev + 1);
    }

    setTimeout(() => setLighting(false), 1200);
    setTimeout(() => setGlowPulse(false), 2000);
  }, [hasLit, lighting]);

  return (
    <div className="bg-[#050505] text-[#e5e2e1] min-h-screen font-body w-full selection:bg-[#c9a84c] selection:text-[#050505] relative overflow-hidden">

      {/* ═══ Custom Atmospheric Animations ═══ */}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; text-shadow: 0 0 20px rgba(230,195,100,0.8); transform: scale(1); }
          25% { opacity: 0.8; text-shadow: 0 0 10px rgba(230,195,100,0.4); transform: scale(0.98); }
          50% { opacity: 0.95; text-shadow: 0 0 25px rgba(230,195,100,0.9); transform: scale(1.02); }
          75% { opacity: 0.85; text-shadow: 0 0 15px rgba(230,195,100,0.5); transform: scale(0.99); }
        }
        @keyframes slow-pan {
          0% { object-position: 50% 0%; }
          50% { object-position: 50% 10%; }
          100% { object-position: 50% 0%; }
        }
        @keyframes noise {
          0%, 100% { transform: translate(0,0); }
          10% { transform: translate(-5%,-5%); }
          20% { transform: translate(-10%,5%); }
          30% { transform: translate(5%,-10%); }
          40% { transform: translate(-5%,15%); }
          50% { transform: translate(-10%,5%); }
          60% { transform: translate(15%,0); }
          70% { transform: translate(0,15%); }
          80% { transform: translate(3%,35%); }
          90% { transform: translate(-10%,10%); }
        }
        @keyframes glow-burst {
          0% { box-shadow: 0 0 0 0 rgba(230,195,100,0.6), 0 20px 60px rgba(230,195,100,0.15); }
          30% { box-shadow: 0 0 40px 20px rgba(230,195,100,0.4), 0 20px 80px rgba(230,195,100,0.3); }
          100% { box-shadow: 0 0 20px 5px rgba(230,195,100,0.1), 0 20px 60px rgba(230,195,100,0.15); }
        }
        @keyframes flame-rise {
          0% { transform: scale(1) translateY(0); filter: brightness(1); }
          20% { transform: scale(1.3) translateY(-8px); filter: brightness(1.5); }
          60% { transform: scale(1.1) translateY(-4px); filter: brightness(1.2); }
          100% { transform: scale(1) translateY(0); filter: brightness(1); }
        }
        @keyframes count-pop {
          0% { transform: scale(1); }
          30% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
        @keyframes ring-expand {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        .animate-flicker { animation: flicker 3s ease-in-out infinite; }
        .animate-glow-burst { animation: glow-burst 1.5s ease-out forwards; }
        .animate-flame-rise { animation: flame-rise 1.2s ease-out forwards; }
        .animate-count-pop { animation: count-pop 0.6s ease-out; }
        .animate-ring-expand { animation: ring-expand 1s ease-out forwards; }
        .bg-noise {
          position: absolute;
          inset: -50%;
          width: 200%;
          height: 200%;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          animation: noise 8s steps(4) infinite;
          pointer-events: none;
        }
      `}</style>

      {/* Background Noise Layer */}
      <div className="bg-noise z-0 fixed"></div>

      <main className="flex-1 relative z-10 pt-20">

        {/* ═══ HERO SECTION (Atmospheric Memorial) ═══ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 overflow-hidden">

          {/* Subtle Backglow */}
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#e6c364]/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000"></div>

          {/* Fading bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 pointer-events-none"></div>

          <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center justify-center">

             {/* Portrait */}
             <div className={`mb-12 inline-block relative transition-all duration-[2s] ease-out delay-100 ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}>
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#e6c364]/20 to-transparent blur-3xl animate-pulse"></div>

                {/* Image Masked in a perfect circle with gold glowing border */}
                <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full p-[3px] bg-gradient-to-b from-[#e6c364]/60 via-white/5 to-transparent overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] group">
                   <div className="w-full h-full rounded-full overflow-hidden bg-[#050505]">
                      <img
                        alt="Tahir 'TahirFuego' Mukhtar portrait"
                        className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                        src="/images/tahir-fuego-color.png"
                        style={{ animation: 'slow-pan 30s ease-in-out infinite' }}
                      />
                   </div>
                </div>
             </div>

             {/* Typography Block */}
             <div className={`transition-all duration-[1.5s] ease-out delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h1 className="font-headline text-7xl md:text-9xl font-black uppercase tracking-tighter text-white mb-2 drop-shadow-2xl">
                  Tahir<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6c364] to-[#c9a84c]">Fuego</span>
                </h1>

                <p className="font-headline text-xl md:text-3xl font-light text-white/50 tracking-[0.4em] uppercase mb-6">
                  Tahir Mukhtar
                </p>

                <div className="flex items-center justify-center gap-4 text-[#e6c364]/50 font-label text-sm md:text-base tracking-[0.2em] uppercase mb-10">
                  <span>January 7, 2002</span>
                  <span className="w-1 h-1 rounded-full bg-[#e6c364]/50"></span>
                  <span>January 31, 2026</span>
                </div>

                <p className="font-body text-lg md:text-2xl italic text-white/60 tracking-wide max-w-2xl mx-auto leading-relaxed border-l-2 border-[#e6c364]/40 pl-6">
                  "A son of Kashmir. A warrior of Free Fire. A soul that burned too bright."
                </p>
             </div>

             {/* ═══ Interactive Candle Widget (Glassmorphic + Persistent) ═══ */}
             <div className={`mt-16 transition-all duration-[1.5s] ease-out delay-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                <div className="relative">
                  {/* Ember Particles Canvas */}
                  <EmberParticles active={emberBurst} />

                  {/* Expanding Ring on Light */}
                  {glowPulse && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                      <div className="w-32 h-32 rounded-full border-2 border-[#e6c364]/60 animate-ring-expand" />
                    </div>
                  )}

                  <button
                    onClick={handleLightCandle}
                    disabled={hasLit}
                    className={`group relative flex flex-col items-center gap-3 px-12 py-8 backdrop-blur-xl border transition-all duration-500 rounded-3xl overflow-hidden shadow-2xl focus:outline-none ${
                      hasLit
                        ? 'border-[#e6c364]/60 bg-[#1a1710]/90 cursor-default'
                        : 'border-white/10 hover:border-[#e6c364]/40 bg-[#13110e]/60 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(230,195,100,0.15)]'
                    } ${glowPulse ? 'animate-glow-burst' : ''}`}
                  >
                    {/* Subtle Background Inner Glow */}
                    {hasLit && <div className="absolute inset-0 bg-gradient-to-b from-[#e6c364]/10 to-transparent pointer-events-none" />}

                    <span
                      className={`material-symbols-outlined text-5xl transition-all duration-300 relative z-10 ${
                        hasLit ? "text-[#e6c364] animate-flicker" : "text-white/30 group-hover:text-[#e6c364]/60"
                      } ${lighting ? 'animate-flame-rise' : ''}`}
                      style={{'fontVariationSettings': hasLit ? "'FILL' 1" : "'FILL' 0"}}
                    >
                      {hasLit ? "local_fire_department" : "workspace_premium"}
                    </span>

                    <div className="text-center relative z-10">
                      <span className={`block font-headline text-sm font-bold uppercase tracking-[0.3em] transition-colors ${hasLit ? 'text-[#e6c364]' : 'text-white/60 group-hover:text-white'}`}>
                        {hasLit ? 'Fire Keeps Burning' : 'Light a Candle'}
                      </span>
                      <span className={`block font-body text-xs mt-2 font-medium tracking-wider uppercase transition-colors ${hasLit ? 'text-white/80' : 'text-white/30'}`}>
                        <AnimatedCount value={candleCount} /> {candleCount === 1 ? 'candle' : 'candles'} lit worldwide
                      </span>
                    </div>
                  </button>
                </div>
             </div>
          </div>

          {/* Vertical Decoration - Sovereign Aesthetic */}
          <div className="absolute left-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-8 opacity-20 hover:opacity-100 transition-opacity duration-1000">
             <div className="w-px h-32 bg-gradient-to-b from-transparent to-[#e6c364]"></div>
             <span className="font-headline text-6xl font-black uppercase tracking-widest text-transparent" style={{'WebkitTextStroke': '1px #e6c364', 'writingMode': 'vertical-rl'}}>
                IN MEMORIAM
             </span>
             <div className="w-px h-32 bg-gradient-to-t from-transparent to-[#e6c364]"></div>
          </div>
        </section>

        {/* ═══ LEGACY SECTION (Bento Immersive Layout) ═══ */}
        <section className="py-32 px-6 max-w-7xl mx-auto relative z-20">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

             {/* Left - Large Photographic Panel */}
             <div className="relative group perspective-1000">
                {/* Glow Behind */}
                <div className="absolute -inset-8 bg-[#e6c364]/5 blur-3xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                <div className="relative z-10 w-full aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 group-hover:border-[#e6c364]/40 transition-colors shadow-2xl bg-[#111111]">
                   <img
                      alt="Tahir in action"
                      className="w-full h-full object-cover grayscale transition-all duration-[2s] group-hover:grayscale-0 group-hover:scale-105"
                      src="/images/tahir-fuego-bw.png"
                   />

                   {/* Bottom Gradient Overlay purely for vignette text contrast */}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80 pointer-events-none"></div>
                </div>

                {/* Brutalist Gold Accent */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-[#e6c364]/30 z-0"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-[#e6c364]/30 z-0"></div>
             </div>

             {/* Right - Typography */}
             <div className="flex flex-col gap-10">
                <div>
                   <div className="flex items-center gap-4 mb-4">
                      <div className="h-px w-16 bg-[#e6c364]/60"></div>
                      <h2 className="font-label text-[#e6c364] font-bold tracking-[0.4em] uppercase text-xs">The Legacy</h2>
                   </div>
                   <h3 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">
                      The Shotgun <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">King</span>
                   </h3>
                </div>

                <div className="space-y-6 text-white/50 font-body text-lg leading-relaxed font-light">
                   <p>
                      Tahir Mukhtar, known to the world as <strong className="text-white">"TahirFuego,"</strong> didn't just play the game; he rewrote the rules of engagement. His mastery of close-quarters combat and his iconic use of the shotgun became a symbol of fear for opponents and a beacon of hope for his legion of fans.
                   </p>
                   <p>
                      Beyond the servers, Tahir was the absolute heart of the Sovereign Arena. His infectious energy, unwavering loyalty to his teammates, and his philosophy of <em className="text-white">"Playing with Fire"</em> defined an era for GodLike Esports. He leaves behind a void that can never be filled, but a legacy that will ignite the hearts of future champions for generations.
                   </p>
                </div>

                {/* Quote Highlight box */}
                <div className="bg-[#13110e]/80 backdrop-blur-xl p-8 rounded-3xl border border-[#e6c364]/20 border-l-[4px] border-l-[#e6c364] mt-4 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-r from-[#e6c364]/5 to-transparent pointer-events-none"></div>
                   <span className="material-symbols-outlined text-[#e6c364]/20 text-6xl absolute -top-2 -right-2 transform -rotate-12 transition-transform group-hover:rotate-0" style={{'fontVariationSettings': '\'FILL\' 1'}}>format_quote</span>

                   <p className="font-headline text-2xl italic font-medium text-white leading-tight relative z-10">
                      "Jab tak shotgun hai, tab tak Tahir hai."
                   </p>
                </div>
             </div>
          </div>
        </section>

        {/* ═══ JOURNEY & ACCOLADES SECTION (Pro-Max Bento) ═══ */}
        <section className="py-32 px-6 relative z-20">
          <div className="max-w-7xl mx-auto">

             <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">

                {/* Left - The Timeline (Col-span 5) */}
                <div className="lg:col-span-5 flex flex-col">
                   <div className="mb-12">
                      <h2 className="font-label text-[#e6c364] font-bold tracking-[0.4em] uppercase text-xs mb-3">The Road</h2>
                      <h3 className="font-headline text-4xl font-black uppercase tracking-tighter text-white">The Timeline</h3>
                   </div>

                   {/* Timeline Pathway structure */}
                   <div className="flex flex-col relative pl-6">
                      <div className="absolute left-[3px] top-6 bottom-6 w-px bg-gradient-to-b from-[#e6c364]/80 via-[#e6c364]/20 to-transparent"></div>

                      {[
                         { years: '2020 - 2021', title: 'THE EMERGENCE', desc: 'Starting the professional journey with local tournaments.' },
                         { years: '2021 - 2023', title: 'DOMINATION ERA', desc: 'Joining GodLike Esports and establishing the persona.' },
                         { years: '2023 - 2025', title: 'GLOBAL IMPACT', desc: 'Representing the nation in international arenas.' },
                         { years: '2026', title: 'ETERNAL LEGACY', desc: 'The story is immortalized in the Sovereign Arena.', highlight: true }
                      ].map((item, index) => (
                         <div key={index} className="relative mb-10 last:mb-0 group">
                            {/* Dot */}
                            <div className={`absolute -left-[27px] top-[14px] w-3 h-3 rounded-full ${item.highlight ? 'bg-[#e6c364] shadow-[0_0_15px_rgba(230,195,100,0.8)]' : 'bg-[#e6c364]/40 group-hover:bg-[#e6c364] group-hover:shadow-[0_0_10px_rgba(230,195,100,0.6)] border-2 border-[#050505]'} transition-all`} />

                            <div className={`p-6 rounded-2xl transition-all duration-300 ${item.highlight ? 'bg-gradient-to-br from-[#1a1710]/90 to-[#13110e]/90 border border-[#e6c364]/40' : 'bg-[#131313]/50 border border-white/5 group-hover:border-[#e6c364]/30 group-hover:bg-[#13110e]/80 hover:-translate-y-1'}`}>
                               <p className="font-label text-[10px] text-[#e6c364] font-bold tracking-widest mb-2">{item.years}</p>
                               <h4 className="font-headline text-lg font-black uppercase tracking-tight text-white mb-2">{item.title}</h4>
                               <p className="text-white/40 text-sm font-body leading-relaxed">{item.desc}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                {/* Right - Accolades Table (Col-span 7) */}
                <div className="lg:col-span-7 flex flex-col">
                   <div className="mb-12">
                      <h2 className="font-label text-[#e6c364] font-bold tracking-[0.4em] uppercase text-xs mb-3">The Accolades</h2>
                      <h3 className="font-headline text-4xl font-black uppercase tracking-tighter text-white">Battle Honors</h3>
                   </div>

                   <div className="w-full bg-[#131313]/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                      <table className="w-full text-left border-collapse">
                         <thead className="bg-white/5 font-label text-[10px] uppercase tracking-widest text-[#e6c364]">
                            <tr>
                               <th className="p-6 font-bold">Tournament</th>
                               <th className="p-6 font-bold">Standing</th>
                               <th className="p-6 font-bold text-right">Year</th>
                            </tr>
                         </thead>
                         <tbody className="font-body text-white/70 text-sm">
                            {[
                               { tourney: 'Pro League Season X', standing: '#1 CHAMPION', standingColor: 'text-[#e6c364]', year: '2024' },
                               { tourney: 'National Championship', standing: '#1 CHAMPION', standingColor: 'text-[#e6c364]', year: '2023' },
                               { tourney: 'Global Invitations', standing: 'Top 3 Finalist', standingColor: 'text-white/60', year: '2024' },
                               { tourney: 'Winter Invite', standing: '#1 CHAMPION', standingColor: 'text-[#e6c364]', year: '2022' },
                               { tourney: 'Rising Stars Cup', standing: 'MVP Award', standingColor: 'text-white/60', year: '2021' },
                            ].map((row, i) => (
                               <tr key={i} className="border-t border-white/5 hover:bg-white/[0.03] transition-colors group cursor-default">
                                  <td className="p-6 font-headline font-bold text-white tracking-wide group-hover:text-[#e6c364] transition-colors">{row.tourney}</td>
                                  <td className="p-6">
                                     <span className={`font-bold ${row.standingColor}`}>{row.standing}</span>
                                  </td>
                                  <td className="p-6 text-right font-label tracking-widest">{row.year}</td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>

             </div>
          </div>
        </section>

        {/* ═══ QUOTES GRID SECTION (Bento Style) ═══ */}
        <section className="py-24 px-6 relative z-20">
          <div className="max-w-7xl mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Featured Large Quote (Takes up half) */}
                <div className="md:col-span-2 bg-gradient-to-br from-[#1a1710] to-[#0a0a09] p-10 md:p-12 flex flex-col justify-between rounded-3xl border border-[#e6c364]/30 shadow-2xl group relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-[#e6c364]/10 blur-[80px] rounded-full pointer-events-none"></div>

                   <div className="relative z-10">
                      <span className="material-symbols-outlined text-[#e6c364]/80 text-6xl mb-6 drop-shadow-lg" style={{'fontVariationSettings': '\'FILL\' 1'}}>format_quote</span>
                      <h4 className="font-headline text-3xl md:text-4xl font-black text-white uppercase leading-tight tracking-tighter">
                        "Victory is not in the trophy, but in the fire you leave behind."
                      </h4>
                   </div>
                   <p className="mt-10 font-label uppercase tracking-widest text-[#e6c364] font-bold text-xs relative z-10">— Tahir Mukhtar</p>
                </div>

                {/* The Flame */}
                <div className="bg-[#131313]/60 backdrop-blur-xl p-10 rounded-3xl border border-white/5 hover:border-white/20 transition-all flex flex-col justify-center text-left">
                   <h5 className="font-label text-xs font-bold text-[#e6c364] uppercase mb-4 tracking-[0.3em]">THE FLAME</h5>
                   <p className="font-body text-white/60 leading-relaxed italic border-l-2 border-white/10 pl-4">
                     "Don't play safe. Safe is for people who are afraid to lose. Play to win, or don't play at all."
                   </p>
                </div>

                {/* The Brotherhood */}
                <div className="bg-[#13110e]/80 backdrop-blur-xl p-10 rounded-3xl border border-[#e6c364]/20 hover:border-[#e6c364]/50 transition-all flex flex-col justify-center">
                   <h5 className="font-label text-xs font-bold text-[#e6c364] uppercase mb-4 tracking-[0.3em]">THE BROTHERHOOD</h5>
                   <p className="font-body text-white/80 leading-relaxed font-bold">
                     "My team is my family. We bleed GodLike gold together."
                   </p>
                </div>

                {/* Bottom Full-Width Strip */}
                <div className="md:col-span-full bg-[#111111]/90 backdrop-blur-3xl p-10 rounded-3xl border border-white/5 relative overflow-hidden group flex items-center justify-between gap-8 mt-2">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e6c364]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[2s] pointer-events-none"></div>

                   <h4 className="font-headline text-2xl md:text-3xl font-black text-white/80 uppercase tracking-tight relative z-10">
                      "I am the shotgun king because I am never afraid of being too close."
                   </h4>
                   <div className="opacity-[0.03] group-hover:opacity-10 transition-opacity hidden sm:block relative z-10">
                      <span className="material-symbols-outlined text-8xl" data-icon="rocket_launch">rocket_launch</span>
                   </div>
                </div>

             </div>
          </div>
        </section>

        {/* ═══ MENTAL HEALTH RESOURCES (Footer) ═══ */}
        <section className="py-24 px-6 border-t border-white/5 relative z-20 bg-[#050505]/95">
          <div className="max-w-4xl mx-auto text-center">

             <div className="flex justify-center mb-8">
                <span className="material-symbols-outlined text-[#e6c364] text-4xl">favorite</span>
             </div>

             <h3 className="font-headline text-4xl font-black uppercase tracking-tighter text-white mb-6">
                You Are <span className="text-[#e6c364]">Never Alone</span>
             </h3>
             <p className="font-body text-white/50 text-lg mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                In memory of Tahir, we encourage anyone struggling to reach out. The Arena is stronger together. If you or someone you know is in distress, support is immediately available.
             </p>

             <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6">

                <a
                  href="https://findahelpline.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-10 py-5 bg-[#13110e]/60 backdrop-blur-xl border border-white/10 rounded-full font-headline uppercase font-bold text-sm tracking-widest text-white transition-all overflow-hidden hover:border-[#e6c364]/60 flex items-center justify-center gap-4 hover:-translate-y-1 shadow-lg"
                >
                   <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#e6c364]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                   <span className="material-symbols-outlined text-[#e6c364] text-2xl relative z-10">support_agent</span>
                   <span className="relative z-10 group-hover:text-[#e6c364] transition-colors">CRISIS HELPLINE</span>
                </a>

                <a
                  href="https://checkpointorg.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-10 py-5 bg-[#131313]/60 backdrop-blur-xl border border-white/10 rounded-full font-headline uppercase font-bold text-sm tracking-widest text-white transition-all overflow-hidden hover:border-[#e6c364]/60 flex items-center justify-center gap-4 hover:-translate-y-1 shadow-lg"
                >
                   <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#e6c364]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                   <span className="material-symbols-outlined text-white/50 group-hover:text-[#e6c364] transition-colors text-2xl relative z-10">forum</span>
                   <span className="relative z-10 group-hover:text-[#e6c364] transition-colors">MENTAL HEALTH HUB</span>
                </a>

             </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Heartbreak;
