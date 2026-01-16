import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Extracting: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate extraction process
    const timer = setTimeout(() => {
      navigate('/recipe/1');
    }, 3500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden border-x border-warm-gray/20">
      {/* TopAppBar */}
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
        <button 
          onClick={() => navigate(-1)}
          className="text-warm-charcoal dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
        </button>
        <h2 className="text-warm-charcoal dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">New Recipe</h2>
      </div>

      {/* Input Section */}
      <div className="flex flex-col gap-4 px-4 py-3">
        <label className="flex flex-col flex-1">
          <p className="text-warm-charcoal dark:text-gray-200 text-base font-medium leading-normal pb-2">Video Link</p>
          <div className="flex w-full flex-1 items-stretch rounded-xl shadow-sm">
            <input 
              readOnly
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl rounded-r-none border border-warm-gray dark:border-gray-700 bg-white dark:bg-background-dark focus:outline-0 h-14 placeholder:text-[#9c5749] dark:placeholder:text-gray-500 p-[15px] pr-2 text-base font-normal leading-normal text-warm-charcoal dark:text-white transition-all opacity-80" 
              value="https://youtu.be/watch?v=cooking_video_id"
            />
            <div className="text-[#9c5749] dark:text-primary flex border border-warm-gray dark:border-gray-700 bg-white dark:bg-background-dark items-center justify-center pr-[15px] pl-2 rounded-r-xl border-l-0">
              <span className="material-symbols-outlined text-[24px]">link</span>
            </div>
          </div>
        </label>
        
        <button disabled className="flex w-full cursor-not-allowed items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary/90 text-[#fcf9f8] gap-2 pl-5 text-base font-bold leading-normal tracking-[0.015em] shadow-md shadow-primary/20 transition-all opacity-90">
          <span className="material-symbols-outlined text-[24px] animate-spin">progress_activity</span>
          <span className="truncate">Extracting...</span>
        </button>
      </div>

      <div className="h-px w-full bg-gray-200 dark:bg-white/10 my-2"></div>

      {/* AI Feedback Zone */}
      <div className="flex flex-col px-4 py-6 animate-pulse-slow">
        <div className="flex flex-col items-center gap-6">
          <div 
            className="bg-center bg-no-repeat aspect-video bg-cover rounded-2xl w-full max-w-[360px] shadow-lg shadow-black/5 relative overflow-hidden" 
            style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCc4UINhfkOkj6Xuc-tno-yZP53_yWQYToYOfS9nX3NLtnXiFB8UsNM4XDJiw0Xxx_WLgrY2f3v0RKa171Gg6ZGoNkXaWv_BoIzI-Ddkza10WLFaCasn-I6lIpVgeNdsKig5QrBNjuNQq34EH8t8zZFJCGGkzdc-IAvMBiq_farA_dYS3yG0ELiVuuA-1oOXmhP0F1inWiBbP5pwBHMstxLRNbSFH4RiJzH63yiWivl718T13sy9ZkWCeex9Yice_hVpHzLP151gGE")` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">smart_toy</span>
                <span className="text-sm font-medium opacity-90">AI Chef is active</span>
              </div>
            </div>
          </div>
          <div className="flex max-w-[480px] flex-col items-center gap-2">
            <p className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">Cooking up your recipe...</p>
            <p className="text-slate-500 dark:text-gray-400 text-sm font-normal leading-normal max-w-[480px] text-center">Our AI is watching the video and identifying ingredients for you.</p>
          </div>
        </div>
      </div>

      {/* ProgressBar */}
      <div className="flex flex-col gap-3 px-6 pb-6">
        <div className="flex gap-6 justify-between items-center">
          <p className="text-primary text-sm font-bold uppercase tracking-wider leading-normal">Parsing ingredients</p>
          <span className="text-xs font-bold text-slate-400 dark:text-gray-500">45%</span>
        </div>
        <div className="rounded-full bg-gray-200 dark:bg-gray-800 h-2 overflow-hidden">
          <div className="h-full rounded-full bg-primary relative w-[45%] shadow-[0_0_10px_rgba(242,51,13,0.5)]">
            <div 
              className="absolute inset-0 w-full" 
              style={{ 
                backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                animation: 'shimmer 2s infinite',
                transform: 'translateX(-100%)'
              }}
            ></div>
          </div>
        </div>
        <style>{`
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>

      {/* Skeleton Content */}
      <div className="flex flex-col px-4 gap-6 pb-8">
        <div className="flex flex-col gap-3">
          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          <div className="flex flex-wrap gap-2">
            <div className="h-8 w-20 bg-gray-100 dark:bg-gray-800/50 rounded-lg animate-pulse"></div>
            <div className="h-8 w-28 bg-gray-100 dark:bg-gray-800/50 rounded-lg animate-pulse delay-75"></div>
            <div className="h-8 w-16 bg-gray-100 dark:bg-gray-800/50 rounded-lg animate-pulse delay-100"></div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-5 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0 animate-pulse"></div>
            <div className="flex flex-col gap-2 w-full">
              <div className="h-4 w-full bg-gray-100 dark:bg-gray-800/50 rounded animate-pulse"></div>
              <div className="h-4 w-[90%] bg-gray-100 dark:bg-gray-800/50 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Extracting;