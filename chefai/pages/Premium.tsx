import React from 'react';
import { useNavigate } from 'react-router-dom';

const Premium: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden group/design-root bg-[#FFFDF5] dark:bg-[#1a1c18] text-olive-dark dark:text-olive-light">
      {/* Top Navigation (Close Button) */}
      <div className="flex items-center justify-end px-6 pt-6 pb-2">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center rounded-full w-10 h-10 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="px-6 pb-6">
        <div className="flex flex-col items-center text-center">
          {/* Abstract Premium Icon/Graphic */}
          <div className="mb-6 relative w-24 h-24 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-primary animate-pulse-slow">
            <span className="material-symbols-outlined text-[48px]">auto_awesome</span>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-olive-dark dark:bg-white rounded-full flex items-center justify-center border-2 border-[#FFFDF5] dark:border-[#1a1c18]">
              <span className="material-symbols-outlined text-white dark:text-olive-dark text-[18px]">chef_hat</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-3 text-olive-dark dark:text-white">
             Unlock Your <br/> Inner Chef
          </h1>
          <p className="text-base md:text-lg text-olive-dark/70 dark:text-olive-light/70 font-medium max-w-xs mx-auto">
             Join 10,000+ Pro Chefs using AI to master their kitchen.
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="px-4 mb-8">
        <div className="bg-white dark:bg-[#252a22] rounded-2xl p-5 shadow-sm border border-stone-100 dark:border-stone-800">
          <h3 className="text-center text-sm font-bold uppercase tracking-wider text-olive-dark/60 dark:text-olive-light/60 mb-6">Why Go Pro?</h3>
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 mb-4 text-xs font-bold text-center pb-2 border-b border-stone-100 dark:border-stone-700">
            <div className="col-span-6 text-left pl-2 text-olive-dark dark:text-olive-light">Feature</div>
            <div className="col-span-3 text-olive-dark/50 dark:text-olive-light/50">Free</div>
            <div className="col-span-3 text-primary">PRO</div>
          </div>
          
          {[
            { name: "AI Generations", icon: "smart_toy", free: "3/mo", pro: "icon:all_inclusive" },
            { name: "Ads", icon: "block", free: "Yes", pro: "None" },
            { name: "Cloud Sync", icon: "cloud_sync", free: "icon:close", pro: "icon:check_circle" },
            { name: "Video-to-Text", icon: "subtitles", free: "Basic", pro: "99% Acc." },
          ].map((row, idx) => (
             <div key={idx} className="grid grid-cols-12 gap-2 mb-4 items-center text-sm last:mb-0">
                <div className="col-span-6 flex items-center gap-2 pl-2 font-medium">
                  <span className="material-symbols-outlined text-secondary text-[18px]">{row.icon}</span>
                  {row.name}
                </div>
                <div className="col-span-3 text-center flex justify-center text-olive-dark/50 dark:text-olive-light/50 font-medium">
                  {row.free.startsWith('icon:') ? <span className="material-symbols-outlined text-[18px]">{row.free.split(':')[1]}</span> : row.free === 'Yes' ? <span className="text-xs px-2 py-0.5 bg-stone-100 dark:bg-stone-700 rounded text-olive-dark/60 dark:text-olive-light/60">Yes</span> : row.free}
                </div>
                <div className="col-span-3 text-center flex justify-center text-primary font-bold">
                   {row.pro.startsWith('icon:') ? <span className="material-symbols-outlined text-[18px]">{row.pro.split(':')[1]}</span> : row.pro}
                </div>
             </div>
          ))}
        </div>
      </div>

      {/* Pricing Selector */}
      <div className="flex-1 px-4 mb-24">
        <div className="flex flex-col gap-4">
          {/* Yearly Card (Selected) */}
          <div className="relative flex-1 group cursor-pointer">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md z-10 uppercase tracking-wide">
               Best Value · Save 50%
            </div>
            <div className="w-full h-full rounded-2xl border-2 border-primary bg-primary/[0.03] dark:bg-primary/[0.05] p-4 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-olive-dark dark:text-white">Yearly</span>
                <span className="material-symbols-outlined text-primary text-[20px] fill-1">check_circle</span>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-extrabold text-olive-dark dark:text-white">$59.99</span>
                <span className="text-sm font-medium text-olive-dark/60 dark:text-olive-light/60">/year</span>
              </div>
              <p className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded text-center">Just $4.99 / month</p>
            </div>
          </div>
          {/* Monthly Card */}
          <div className="flex-1 group cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
            <div className="w-full h-full rounded-2xl border-2 border-transparent bg-white dark:bg-[#252a22] p-4 flex flex-col items-center justify-center shadow-sm hover:border-olive-dark/10 dark:hover:border-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-olive-dark dark:text-white">Monthly</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-olive-dark dark:text-white">$9.99</span>
                <span className="text-sm font-medium text-olive-dark/60 dark:text-olive-light/60">/month</span>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-center text-xs text-olive-dark/50 dark:text-olive-light/40 mt-6 flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-[14px]">verified_user</span> 
          No commitment. Cancel anytime.
        </p>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
         {/* Blur Gradient Backdrop */}
         <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF5] via-[#FFFDF5]/95 to-transparent dark:from-[#1a1c18] dark:via-[#1a1c18]/95 h-full pointer-events-none"></div>
         <div className="relative px-6 pb-8 pt-4 max-w-md mx-auto w-full">
           <button className="w-full bg-primary hover:bg-red-600 text-white font-bold text-lg py-4 px-6 rounded-2xl shadow-xl shadow-primary/20 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 mb-4">
             <span>Start 7-Day Free Trial</span>
             <span className="material-symbols-outlined">arrow_forward</span>
           </button>
           <div className="flex justify-between items-center px-4 text-[10px] md:text-xs font-medium text-olive-dark/40 dark:text-olive-light/40">
             <button className="hover:text-olive-dark dark:hover:text-olive-light transition-colors">Privacy Policy</button>
             <button className="hover:text-olive-dark dark:hover:text-olive-light transition-colors">Restore Purchase</button>
             <button className="hover:text-olive-dark dark:hover:text-olive-light transition-colors">Terms of Use</button>
           </div>
         </div>
      </div>
    </div>
  );
};

export default Premium;