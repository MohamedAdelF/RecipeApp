import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const ShoppingList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden pb-24">
      {/* Sticky Header with Safe Area Padding */}
      <header className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 px-4 pb-2 pt-[calc(1.5rem+env(safe-area-inset-top))] backdrop-blur-md border-b border-gray-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Shopping List</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mt-0.5">32 items • 4 recipes</p>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-white/5 text-primary shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-gray-100 dark:border-white/5">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>
        {/* Quick Add Input */}
        <div className="relative mt-2 mb-3 group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '20px' }}>add</span>
          </div>
          <input 
            className="block w-full rounded-xl border-none bg-white dark:bg-white/5 py-3.5 pl-10 pr-12 text-sm text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary transition-all font-medium" 
            placeholder="Add item (e.g., Milk, Eggs)..." 
            type="text"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <button className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mic</span>
            </button>
          </div>
        </div>
        {/* Sort/Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          <button className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold whitespace-nowrap shadow-md shadow-primary/20">
            By Aisle
          </button>
          <button className="px-4 py-1.5 rounded-full bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs font-semibold whitespace-nowrap border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            By Recipe
          </button>
          <button className="px-4 py-1.5 rounded-full bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs font-semibold whitespace-nowrap border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            Recent
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pt-4 space-y-6">
        {/* AI Suggestion Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 p-4 flex items-start gap-3 border border-primary/10">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-primary mb-0.5">Smart Sorting Active</p>
            <p className="text-xs text-slate-900 dark:text-white leading-relaxed">
              I've grouped your ingredients by aisle to save you time. <span className="font-semibold underline cursor-pointer hover:text-primary">Undo</span>
            </p>
          </div>
        </div>

        {/* Section: Produce */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">nutrition</span> Produce
            </h3>
            <span className="text-xs font-medium text-gray-500 bg-white dark:bg-white/5 px-2 py-0.5 rounded-full border border-gray-200 dark:border-white/10">5 items</span>
          </div>
          <div className="bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
             {[
               { name: "Roma Tomatoes", meta: "4 units", tag: "Caprese Salad", color: "blue" },
               { name: "Fresh Basil", meta: "1 bunch", tag: "Caprese Salad", color: "blue" },
               { name: "Lemons", meta: "2 large", tag: "Grilled Salmon", color: "orange" }
             ].map((item, idx) => (
               <label key={idx} className="group flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0">
                 <div className="relative flex items-center pt-0.5">
                   <input className="peer h-6 w-6 cursor-pointer appearance-none rounded-full border-2 border-gray-300 dark:border-gray-600 transition-all checked:border-primary checked:bg-primary focus:ring-0 focus:ring-offset-0" type="checkbox" />
                   <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[14px] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">check</span>
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-base font-medium text-slate-900 dark:text-white peer-checked:line-through peer-checked:text-gray-400 dark:peer-checked:text-gray-500 transition-colors truncate">
                     {item.name}
                   </p>
                   <div className="flex items-center gap-2 mt-1">
                     <span className="text-xs font-semibold text-gray-500">{item.meta}</span>
                     <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                     <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold ring-1 ring-inset ${item.color === 'blue' ? 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-400/20' : 'bg-orange-50 text-orange-700 ring-orange-700/10 dark:bg-orange-900/30 dark:text-orange-300 dark:ring-orange-400/20'}`}>
                       {item.tag}
                     </span>
                   </div>
                 </div>
               </label>
             ))}
          </div>
        </section>

        {/* Section: Dairy */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">egg</span> Dairy & Cheese
            </h3>
            <span className="text-xs font-medium text-gray-500 bg-white dark:bg-white/5 px-2 py-0.5 rounded-full border border-gray-200 dark:border-white/10">2 items</span>
          </div>
          <div className="bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
             {[
               { name: "Mozzarella di Bufala", meta: "200g", tag: "Caprese Salad", color: "blue" },
               { name: "Greek Yogurt", meta: "500g Tub", tag: null, color: null }
             ].map((item, idx) => (
               <label key={idx} className="group flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0">
                 <div className="relative flex items-center pt-0.5">
                   <input className="peer h-6 w-6 cursor-pointer appearance-none rounded-full border-2 border-gray-300 dark:border-gray-600 transition-all checked:border-primary checked:bg-primary focus:ring-0 focus:ring-offset-0" type="checkbox" />
                    <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[14px] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">check</span>
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-base font-medium text-slate-900 dark:text-white peer-checked:line-through peer-checked:text-gray-400 dark:peer-checked:text-gray-500 transition-colors truncate">
                     {item.name}
                   </p>
                   <div className="flex items-center gap-2 mt-1">
                     <span className="text-xs font-semibold text-gray-500">{item.meta}</span>
                     {item.tag && (
                       <>
                        <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                        <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold ring-1 ring-inset ${item.color === 'blue' ? 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-400/20' : ''}`}>
                          {item.tag}
                        </span>
                       </>
                     )}
                   </div>
                 </div>
               </label>
             ))}
          </div>
        </section>

        <div className="pt-4 pb-8">
            <button className="flex w-full items-center justify-between rounded-xl px-4 py-3 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <span className="text-sm font-semibold">Checked Items (12)</span>
            <span className="material-symbols-outlined transition-transform">expand_more</span>
            </button>
        </div>
      </main>

      {/* Floating Action Button with Bottom Padding */}
      <div className="fixed bottom-24 right-4 z-40 max-w-[calc(100vw-2rem)] pb-[env(safe-area-inset-bottom)]">
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all">
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>shopping_cart_checkout</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default ShoppingList;