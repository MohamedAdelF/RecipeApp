import React from 'react';
import { useNavigate } from 'react-router-dom';

const FridgeScan: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-[100dvh] w-full flex flex-col group/design-root overflow-hidden pb-safe">
      {/* Camera Feed Layer */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        <img 
          className="w-full h-full object-cover opacity-90" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwWnH5Buhj6z60_18QC_n14Ord9RRbLRpqQSDTzGDNqJ9kYeh4bFvLwI6TZ_06ZgMhwRSSvzp12BchvZco7IpsEbgzTSIquW8GUU7vj3K1oTqKu6hVCl5Aa1ALsNuSLcmv1In4NecyBF6ORiqs-LrNvB9d3Oo3B3JD_0ViJbqfAsnHVNkPeQgixy1NiLWl1Z_91GmAP-KPpYeoy4ZBWs9TjT-yLBkYGs1N_-lDhT290uolSomJmIs8J9sXzYX6kpmpVCycFfSb3s8" 
          alt="Fridge camera feed" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"></div>
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        ></div>
      </div>

      {/* Top App Bar Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-safe mt-4 px-5 flex items-center justify-between pointer-events-none">
        <button 
          onClick={() => navigate(-1)}
          className="pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-white text-lg font-bold tracking-tight drop-shadow-md">Scan Ingredients</h2>
          <div className="flex items-center gap-1.5 mt-1 bg-black/30 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-white/90 text-[10px] font-medium tracking-wide uppercase">Live Camera</span>
          </div>
        </div>
        <button className="pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors shadow-sm">
          <span className="material-symbols-outlined text-[24px]">flash_on</span>
        </button>
      </div>

      {/* AR Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Center Reticle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/30 rounded-3xl opacity-50 flex items-center justify-center">
          <div className="w-60 h-60 border-[0.5px] border-white/10 rounded-[1.2rem]"></div>
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-lg"></div>
        </div>

        {/* Item 1: Eggs */}
        <div className="absolute top-[48%] left-[12%] w-[120px] h-[100px]">
          <div className="w-full h-full border-2 border-primary/80 rounded-xl shadow-[0_0_20px_rgba(242,51,13,0.3)] bg-primary/5"></div>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/95 backdrop-blur-md pl-2 pr-3 py-1.5 rounded-lg shadow-lg border border-white/50 animate-bounce-slow">
            <div className="flex items-center justify-center w-5 h-5 bg-orange-100 rounded-full text-orange-600">
              <span className="material-symbols-outlined text-[14px]">egg</span>
            </div>
            <span className="text-background-dark font-bold text-sm">Eggs</span>
          </div>
        </div>

        {/* Item 2: Spinach */}
        <div className="absolute top-[35%] right-[15%] w-[140px] h-[140px]">
          <div className="w-full h-full border-2 border-primary/80 rounded-xl shadow-[0_0_20px_rgba(242,51,13,0.3)] bg-primary/5"></div>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/95 backdrop-blur-md pl-2 pr-3 py-1.5 rounded-lg shadow-lg border border-white/50 animate-bounce-slow" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-center w-5 h-5 bg-green-100 rounded-full text-green-600">
              <span className="material-symbols-outlined text-[14px]">eco</span>
            </div>
            <span className="text-background-dark font-bold text-sm">Spinach</span>
          </div>
        </div>

        {/* Item 3: Tomato */}
        <div className="absolute top-[25%] left-[30%] w-[100px] h-[100px]">
          <div className="w-full h-full border-2 border-primary/80 rounded-xl shadow-[0_0_20px_rgba(242,51,13,0.3)] bg-primary/5"></div>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/95 backdrop-blur-md pl-2 pr-3 py-1.5 rounded-lg shadow-lg border border-white/50 animate-bounce-slow" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-center w-5 h-5 bg-red-100 rounded-full text-red-600">
              <span className="material-symbols-outlined text-[14px]">nutrition</span>
            </div>
            <span className="text-background-dark font-bold text-sm">Tomato</span>
          </div>
        </div>
      </div>
      
      {/* Bottom Panel */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col justify-end pointer-events-none pb-safe">
        <div className="w-full flex justify-center mb-4">
          <p className="text-white/80 text-sm font-medium bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
            Keep camera steady to detect more
          </p>
        </div>
        
        <div className="bg-background-light dark:bg-[#1a0f0d] rounded-t-[2rem] shadow-[0_-8px_30px_rgba(0,0,0,0.3)] pointer-events-auto relative">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-20 bg-primary/5 blur-3xl pointer-events-none"></div>
           <div className="p-6 pb-8">
             <div className="w-12 h-1.5 bg-gray-300/50 dark:bg-white/20 rounded-full mx-auto mb-6"></div>
             
             <div className="flex justify-between items-end mb-4 px-1">
               <div>
                 <p className="text-primary text-sm font-bold tracking-wide uppercase mb-1 flex items-center gap-1">
                   <span className="material-symbols-outlined text-sm">auto_awesome</span>
                   AI Detection
                 </p>
                 <h2 className="text-2xl font-extrabold text-background-dark dark:text-white leading-tight">3 ingredients detected</h2>
               </div>
               <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 transition-colors">
                 <span className="material-symbols-outlined text-[20px]">add</span>
               </button>
             </div>

             <div className="flex gap-3 overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar">
               {[
                 { icon: "🍅", name: "Tomato", match: "98%", bg: "bg-[#fff0ed] dark:bg-primary/20" },
                 { icon: "🥬", name: "Spinach", match: "95%", bg: "bg-[#f0fdf4] dark:bg-green-500/20" },
                 { icon: "🥚", name: "Eggs", match: "99%", bg: "bg-[#fff7ed] dark:bg-orange-500/20" }
               ].map((item, idx) => (
                 <div key={idx} className="group relative flex items-center gap-3 bg-white dark:bg-[#2a1d1a] border border-gray-100 dark:border-white/5 p-2 pr-4 rounded-2xl shadow-sm shrink-0 min-w-[140px] hover:border-primary/30 transition-colors cursor-pointer">
                   <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                     <span className="text-2xl">{item.icon}</span>
                   </div>
                   <div className="flex flex-col">
                     <span className="text-sm font-bold text-background-dark dark:text-white group-hover:text-primary transition-colors">{item.name}</span>
                     <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{item.match} match</span>
                   </div>
                 </div>
               ))}
             </div>

             <button 
               onClick={() => navigate('/dashboard')}
               className="relative w-full group overflow-hidden bg-primary text-white font-bold text-lg h-14 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
             >
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
               <span className="relative z-10">See Recipes</span>
               <div className="relative z-10 bg-white/20 rounded-full p-1">
                 <span className="material-symbols-outlined text-[20px] block">arrow_forward</span>
               </div>
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FridgeScan;