import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-[#050505] text-[#e5e2e1] min-h-screen font-body w-full overflow-hidden relative selection:bg-[#c9a84c] selection:text-[#050505]">
      
      {/* ═══ Pro-Max Injected Custom Animations ═══ */}
      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(0.5deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(2%) rotate(0deg); }
          50% { transform: translateY(calc(2% - 15px)) rotate(-0.5deg); }
        }
        @keyframes float-center {
          0%, 100% { transform: translateY(0px) scale(1.05); }
          50% { transform: translateY(-18px) scale(1.06); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.1; filter: blur(40px); }
          50% { opacity: 0.25; filter: blur(60px); }
        }
        @keyframes cinematic-sweep {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
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
        
        .animate-float-1 { animation: float-1 6s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 7s ease-in-out infinite backwards; }
        .animate-float-center { animation: float-center 8s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
        .animate-sweep { background-size: 200% auto; animation: cinematic-sweep 8s linear infinite; }
        
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-1000 { animation-delay: 1000ms; }
        
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

      {/* ═══ The Stage ═══ */}
      <main className="w-full h-screen relative flex flex-col items-center justify-center">
        <section className="absolute inset-0 w-full h-full overflow-hidden bg-[#0a0a09]">
          
          {/* Brutalist Grid Background overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#e6c364 1px, transparent 1px), linear-gradient(90deg, #e6c364 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="bg-noise z-0"></div>

          {/* Golden Center Ambient Backlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#e6c364] rounded-full mix-blend-screen animate-pulse-glow z-0 pointer-events-none"></div>

          {/* Huge Logo Background - Scaled massively */}
          <div className={`absolute top-[5%] md:top-[8%] left-1/2 -translate-x-1/2 w-[1400px] max-w-[180vw] z-0 pointer-events-none flex justify-center transition-all duration-1000 ${mounted ? 'opacity-30 scale-100' : 'opacity-0 scale-[1.05]'}`}>
            <img src="/players/GodL Logo.png" alt="GodLike Logo Overlay" className="w-full h-auto object-contain drop-shadow-[0_0_80px_rgba(230,195,100,0.1)]" />
          </div>

          {/* ═══ THE GOLDEN ARMY (5 Player Composition) ═══ */}
          {/* Note: Delays are staggered so they load in dramatically */}
          <div className="absolute top-1/2 -translate-y-[45%] md:-translate-y-[40%] left-0 right-0 z-10 w-full flex items-end justify-center pointer-events-none px-4 mt-8 md:mt-12">
            
            {/* Player 1 (Far Left) - Yogi */}
            <div className={`z-10 -mr-[8%] md:-mr-[5%] transition-all duration-[1.5s] ease-out ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              <img src="/players/yogi.png" alt="GodLike Yogi" className="h-[45vh] md:h-[50vh] xl:h-[60vh] w-auto object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] animate-float-1 delay-100" />
            </div>
            
            {/* Player 2 (Left) - EcoEco */}
            <div className={`z-20 -mr-[8%] md:-mr-[5%] transition-all duration-[1.5s] ease-out delay-200 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <img src="/players/ecoeco.png" alt="GodLike EcoEco" className="h-[50vh] md:h-[55vh] xl:h-[65vh] w-auto object-contain drop-shadow-[0_0_40px_rgba(0,0,0,0.9)] animate-float-2 delay-300" />
            </div>
            
            {/* Player 3 (Center - Front & Largest) - Nancy */}
            <div className={`z-30 transition-all duration-[1.5s] ease-out delay-500 scale-105 ${mounted ? 'opacity-100 translate-y-0 scale-105' : 'opacity-0 translate-y-12 scale-100'}`}>
              <img src="/players/nancy.png" alt="GodLike Center" className="h-[55vh] md:h-[60vh] xl:h-[70vh] w-auto object-contain drop-shadow-[0_0_50px_rgba(0,0,0,1)] animate-float-center delay-[100ms] brightness-110" />
            </div>
            
            {/* Player 4 (Right) - Marco */}
            <div className={`z-20 -ml-[8%] md:-ml-[5%] transition-all duration-[1.5s] ease-out delay-200 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <img src="/players/marco.png" alt="GodLike Marco" className="h-[50vh] md:h-[55vh] xl:h-[65vh] w-auto object-contain drop-shadow-[0_0_40px_rgba(0,0,0,0.9)] animate-float-2 delay-400" />
            </div>
            
            {/* Player 5 (Far Right) - Nobita */}
            <div className={`z-10 -ml-[8%] md:-ml-[5%] transition-all duration-[1.5s] ease-out ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
              <img src="/players/nobita.png" alt="GodLike Nobita" className="h-[45vh] md:h-[50vh] xl:h-[60vh] w-auto object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] animate-float-1 delay-200" />
            </div>

          </div>

          {/* Heavy Overlay gradient to pop the text & fuse the players into the floor */}
          <div className="absolute bottom-0 inset-x-0 h-[35%] bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent z-[35] pointer-events-none"></div>

          {/* ═══ Cinematic Typography & Call to Action ═══ */}
          <div className="absolute bottom-[6%] md:bottom-[8%] left-1/2 -translate-x-1/2 z-40 text-center w-full px-4 flex flex-col items-center">
            
            <h1 className="font-headline font-black text-[2.5rem] sm:text-[3.5rem] md:text-[5.5rem] lg:text-[6.5rem] xl:text-[8rem] leading-[0.85] uppercase tracking-[-0.01em]">
               {/* Line 1 with staggered slide-up */}
              <span style={{ animation: 'fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards 500ms', opacity: 0 }} className="block text-white flex justify-center items-center gap-4">
                WE ARE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808] italic drop-shadow-[0_0_15px_rgba(255,153,51,0.3)] pr-3">INDIA'S</span>
              </span>
              
               {/* Line 2 with Sweep Gradient Glow */}
              <span style={{ animation: 'fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards 700ms', opacity: 0 }} className="block relative mt-2 md:mt-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6c364] via-[#f7e096] to-[#c9a84c] animate-sweep drop-shadow-[0_0_20px_rgba(230,195,100,0.5)]">
                  GOLDEN ARMY.
                </span>
              </span>
            </h1>

            <div className={`font-label uppercase tracking-[0.5em] text-[#e6c364] text-[10px] md:text-sm font-bold mt-8 md:mt-10 flex items-center justify-center gap-4 transition-all duration-1000 ease-out delay-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="h-px bg-gradient-to-r from-transparent to-[#e6c364]/50 w-12 hidden sm:block"></span>
              Welcome To The Sovereign Arena
              <span className="h-px bg-gradient-to-l from-transparent to-[#e6c364]/50 w-12 hidden sm:block"></span>
            </div>

            {/* Interactive Explore Button */}
            <Link to="/tournaments" style={{ animation: 'fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards 1200ms', opacity: 0 }} className="mt-12 group relative inline-flex items-center justify-center">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#e6c364] to-[#c9a84c] rounded-full blur-md opacity-40 group-hover:opacity-100 group-hover:-inset-1 group-hover:blur-lg transition-all duration-500"></span>
              <span className="relative inline-flex items-center gap-3 px-10 py-4 bg-[#0a0a0a] border border-[#e6c364]/40 rounded-full font-headline font-bold text-[#e6c364] tracking-[0.2em] text-sm uppercase transition-all duration-300 group-hover:bg-[#e6c364] group-hover:text-[#0a0a0a]">
                Explore Legacy
                <span className="material-symbols-outlined text-[18px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </span>
            </Link>

          </div>

        </section>
      </main>
    </div>
  );
}
