import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-[#1c100d] dark:text-white pb-24">
      {/* Top Bar with Safe Area Top Padding */}
      <div className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-transparent dark:border-white/5 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center p-5 pb-2 justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-primary/20" 
              style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCI5ZI0BP8odImconSCMfakvcqiaiKphynbQvqB_iWM0wi7mLBMj7JsblnjqNSr8mC4ereQGckVt0lAYgHjIBBNTuEX6dyi3TkCeB4MzgGec3R8O_es4WHoh0NY9n0rEb30r2HvkNsbUJMTlw1N_gXeqpSbRIhX0fUZGglhpt3JS7PneubsEQ6N8PxDdx4Ish3lBoKq2nX6cffdWF14uPydXdPeXEy-gWGOJZivdvDwXVqci4s_sF2cWFH9n6KUNfp4cTooQcueE8E")` }}
            ></div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Welcome back,</span>
              <h2 className="text-[#1c100d] dark:text-white text-lg font-bold leading-tight">Alex Johnson</h2>
            </div>
          </div>
          <button className="relative flex items-center justify-center rounded-full size-10 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border border-gray-100 dark:border-white/5 shadow-sm">
            <span className="material-symbols-outlined text-[#1c100d] dark:text-white" style={{ fontSize: '24px' }}>notifications</span>
            <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full ring-2 ring-white dark:ring-[#2f1b18]"></span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-5 py-2 mt-2">
        <label className="flex flex-col w-full">
          <div className="relative flex w-full items-center rounded-2xl bg-white dark:bg-white/5 transition-all focus-within:ring-2 focus-within:ring-primary/50 shadow-sm border border-gray-100 dark:border-white/5">
            <div className="absolute left-4 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>search</span>
            </div>
            <input 
              className="w-full bg-transparent border-none py-4 pl-12 pr-12 text-[#1c100d] dark:text-white placeholder:text-gray-400 focus:ring-0 text-base font-medium rounded-2xl" 
              placeholder="Search recipes or paste link..."
            />
            <button className="absolute right-3 p-2 rounded-xl text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mic</span>
            </button>
          </div>
        </label>
      </div>

      {/* Hero Action Card */}
      <div className="px-5 py-4">
        <div className="flex flex-col overflow-hidden rounded-[2rem] shadow-lg shadow-primary/5 bg-white dark:bg-white/5 border border-surface-light dark:border-white/10 relative group cursor-pointer hover:border-primary/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full -mr-8 -mt-8 z-0 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col p-6 gap-4">
            <div className="flex justify-between items-start">
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined filled" style={{ fontSize: '28px', fontVariationSettings: "'FILL' 1" }}>smart_display</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">New</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#1c100d] dark:text-white mb-2">Turn Video into Recipe</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-[90%]">
                Paste a YouTube link to get ingredients and step-by-step instructions instantly using AI.
              </p>
            </div>
            <div className="flex gap-3 mt-2">
              <button 
                onClick={() => navigate('/extracting')}
                className="flex-1 h-12 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md shadow-primary/20"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>link</span>
                Paste Link
              </button>
              <button className="h-12 w-12 bg-gray-50 dark:bg-white/10 text-[#1c100d] dark:text-white rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors border border-gray-200 dark:border-white/5">
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>content_paste</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-5 py-2 grid grid-cols-2 gap-4">
        <button 
          onClick={() => navigate('/fridge-scan')}
          className="group flex flex-col gap-3 p-5 rounded-[1.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm text-left hover:border-primary/30 transition-all active:scale-[0.98]"
        >
          <div className="size-12 rounded-2xl bg-secondary/10 group-hover:bg-secondary text-secondary group-hover:text-white flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>photo_camera</span>
          </div>
          <div>
            <h4 className="font-bold text-[#1c100d] dark:text-white text-base">Scan Fridge</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Cook with what you have</p>
          </div>
        </button>
        
        <button className="group flex flex-col gap-3 p-5 rounded-[1.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm text-left hover:border-primary/30 transition-all active:scale-[0.98]">
          <div className="size-12 rounded-2xl bg-orange-100 group-hover:bg-orange-500 text-orange-600 group-hover:text-white flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>bookmark</span>
          </div>
          <div>
            <h4 className="font-bold text-[#1c100d] dark:text-white text-base">Browse Saved</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Your personal cookbook</p>
          </div>
        </button>
      </div>

      {/* Recently Saved Section */}
      <div className="pt-6 pb-2">
        <div className="px-5 flex items-center justify-between mb-4">
          <h3 className="text-[#1c100d] dark:text-white text-lg font-bold">Recently Saved</h3>
          <button className="text-primary text-sm font-semibold hover:text-primary/80 transition-colors">View All</button>
        </div>
        
        <div className="flex overflow-x-auto px-5 pb-8 gap-4 no-scrollbar snap-x">
          {/* Card 1 */}
          <div 
            onClick={() => navigate('/recipe/1')}
            className="min-w-[280px] w-[280px] snap-start flex flex-col bg-white dark:bg-white/5 rounded-[1.5rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm group cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <div className="relative h-44 w-full overflow-hidden">
              <div 
                className="w-full h-full bg-center bg-cover transform group-hover:scale-105 transition-transform duration-700" 
                style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuC5cL-wIM-1pHzKhIloJcErtUO2SGDqtjuExEFlvy6Uc5VslYNSZ8KmZwClkLeUJIhyQW5uO5dBXD6WU6OazO_d2bwUxW_f7yvZbE14nt7-0mFZo083rCbTwNRkJZZE4mCeIdD_7YSh4OaT77ICkd6B15SvpFZ7q9gCPbVwSyd_K_yTlE-8hlbSHiBiUHJrRMObWko5p4Ug33YaIaVynybnvhzHEPKnmlRWavMRqtZCXb8cXiNBJdRg1vmY1OKkETZ8WziSYNG3b9A")` }}
              ></div>
              <div className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm shadow-sm">
                <span className="material-symbols-outlined text-primary block filled" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </div>
              <div className="absolute bottom-3 left-3 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span> 15 min
              </div>
            </div>
            <div className="p-5 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded-md">Easy</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-md">Vegetarian</span>
              </div>
              <h4 className="text-[#1c100d] dark:text-white font-bold text-lg leading-snug">Spicy Tomato Basil Pasta</h4>
              <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 leading-relaxed">A quick and delicious pasta dish perfect for busy weeknights.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="min-w-[280px] w-[280px] snap-start flex flex-col bg-white dark:bg-white/5 rounded-[1.5rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm group cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]">
            <div className="relative h-44 w-full overflow-hidden">
              <div 
                className="w-full h-full bg-center bg-cover transform group-hover:scale-105 transition-transform duration-700" 
                style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDTreW6GHbV-QcRd-HNLcMbkamgg1j1VqUDUy-82pqzXgittl9NAi7Pj9sQDlT4247vbA8QValyUc_uNbtporY7GZ6X1EKU-irTYqwVOMvb-1UfGWQXkF76sVycRWhVpfTQk6z_qa6GiG_2KO5u7DjQXxiqY6n8Z-rq4Maeaf9UQSDGUoWj5h_n94Wm1dFkCykcs3sWLmow6ShnQSVhZ2rA2LHdDuC5WxGNAgpdixghVkM55Qr2BUEeIyqm5dhPJEpWjqgBTB7hxH0")` }}
              ></div>
              <div className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm shadow-sm">
                <span className="material-symbols-outlined text-gray-400 block" style={{ fontSize: '20px' }}>favorite</span>
              </div>
              <div className="absolute bottom-3 left-3 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span> 25 min
              </div>
            </div>
            <div className="p-5 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">Healthy</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded-md">GF</span>
              </div>
              <h4 className="text-[#1c100d] dark:text-white font-bold text-lg leading-snug">Grilled Salmon & Avocado</h4>
              <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 leading-relaxed">Fresh, healthy, and packed with omega-3s.</p>
            </div>
          </div>
          
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;