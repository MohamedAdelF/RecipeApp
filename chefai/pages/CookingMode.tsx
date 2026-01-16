import React from 'react';
import { useNavigate } from 'react-router-dom';

const CookingMode: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display h-[100dvh] w-full overflow-hidden flex flex-col">
      {/* Top Navigation & Progress with Safe Area Padding */}
      <header className="flex-none px-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-4 bg-background-light dark:bg-background-dark z-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Dinner Prep</span>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">Step 3 <span className="text-slate-400 font-normal">of 12</span></h2>
            </div>
          </div>
          <button 
            onClick={() => navigate(-1)}
            aria-label="Exit Cooking Mode" 
            className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '25%' }}></div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 py-2 flex flex-col gap-6 no-scrollbar">
        {/* Media Player / Video Snippet */}
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-100 dark:bg-white/5 shadow-lg shrink-0 group">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:scale-105 transition-transform duration-700" 
            style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCQXTwapaniAOk1movnc4cmLxZuo_z5GjdWlrDqGjs8so64CmUGxtSOkw8mzsZt7TPtJnYLu-GwLJs7xKGr5Hdx3p5i38QZ5OQacOYkbQAFwp2QdYOrdQOUeshwn7LMglNz_NOXaEzAQ0fkS4KX13rR8TRCMmAsgLjxszFbnfv4eAPxuyXIAOqpkCjUNpx0_G2iBIPosulMdVWdPEXWMBMXCKc98WPVxgKwQPjIXLfPIxkjoo5g5FQT95Qmp81RuZqk0jAjKeYBiG4")` }}
          ></div>
          <div className="absolute inset-0 bg-black/10"></div>
          {/* Play/Pause Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="flex items-center justify-center w-16 h-16 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 shadow-xl hover:bg-primary hover:border-primary transition-all duration-300 active:scale-95">
              <span className="material-symbols-outlined text-4xl fill-1">play_arrow</span>
            </button>
          </div>
          {/* Video Badge */}
          <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-white text-xs font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">videocam</span>
            <span>Loop</span>
          </div>
        </div>

        {/* Large Instruction Text */}
        <div className="flex-1 flex flex-col justify-start py-4">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-900 dark:text-white">
            Dice the onions finely and sauté until translucent.
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium">
            Heat the olive oil in a pan over medium heat before adding the onions.
          </p>
        </div>

        {/* Timer Widget */}
        <div className="w-full mb-4">
          <div className="bg-white dark:bg-[#2a2a2a] border border-slate-100 dark:border-white/5 rounded-[20px] p-4 flex items-center justify-between shadow-xl shadow-slate-200/50 dark:shadow-black/20">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">timer</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Timer</span>
                <span className="text-2xl font-bold font-display tabular-nums">05:00</span>
              </div>
            </div>
            <button className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30 flex items-center gap-2 active:scale-95">
              Start
              <span className="material-symbols-outlined">play_arrow</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer / Controls with Safe Area Padding */}
      <footer className="flex-none px-6 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] bg-background-light dark:bg-background-dark border-t border-slate-100 dark:border-white/5">
        <div className="flex items-center justify-between gap-4">
          <button className="flex-1 h-16 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 flex items-center justify-center transition-all active:scale-95 border border-transparent dark:border-white/5">
            <span className="material-symbols-outlined text-3xl">chevron_left</span>
          </button>
          
          <div className="flex-none w-20 flex flex-col items-center justify-center gap-2 -mt-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-orange-500 shadow-xl shadow-primary/30 flex items-center justify-center text-white relative animate-pulse-slow">
              <div className="absolute inset-0 rounded-full border-[3px] border-white/20 scale-110"></div>
              <span className="material-symbols-outlined text-4xl">mic</span>
            </div>
          </div>
          
          <button className="flex-1 h-16 rounded-2xl bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95">
            <span className="text-lg font-bold">Next</span>
            <span className="material-symbols-outlined text-3xl">chevron_right</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CookingMode;