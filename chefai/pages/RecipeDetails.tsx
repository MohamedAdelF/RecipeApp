import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeDetails: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pb-40">
      {/* Header / Hero Section */}
      <div className="relative w-full h-[45vh] min-h-[360px] flex flex-col justify-between overflow-hidden rounded-b-[2.5rem] group/design-root shadow-xl shadow-black/20">
        {/* Top Nav (Absolute) */}
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 pt-[calc(1rem+env(safe-area-inset-top))]">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition border border-white/10"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex gap-3">
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition border border-white/10">
              <span className="material-symbols-outlined">share</span>
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition border border-white/10">
              <span className="material-symbols-outlined">favorite</span>
            </button>
          </div>
        </div>
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCaBXffYRpJodrH1Z5Aj8pIQIjwwx_30w-SeMyWMmbOJXon97eU8Z9XHl-exP2NBibx6KfcWQs56ZTCfjWmbMgtyj_s4p0Fv2Z5OkUGyQMgKshyu35eBWiUPJPvctVKiMMfh0u1ewIW6dgj1GYaQuYYKArWMf5mCeh8RekZQUV6QmXf7saB9RpzPaScwBMpYQpAGrmP6PR5QwtCfKbCT4FLshiqXpHJ7lGZpZPCYE8G0PDvqg09pcEmDLE19CwhLQui9OweGLTBy_o")` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 p-6 flex flex-col justify-end h-full">
          {/* Play Button Overlay Hint */}
          <div className="self-center mb-auto mt-auto">
            <button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 hover:scale-105 transition active:scale-95 shadow-lg shadow-black/20">
              <span className="material-symbols-outlined text-white text-4xl fill-1">play_arrow</span>
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-1 rounded-md bg-primary text-white text-xs font-bold uppercase tracking-wider shadow-sm">New</span>
              <span className="px-2 py-1 rounded-md bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/10">Italian</span>
            </div>
            <h1 className="text-white tracking-tight text-3xl font-bold leading-tight drop-shadow-md">Spicy Tomato Basil Pasta</h1>
            {/* Reaction Bar */}
            <div className="flex flex-wrap gap-4 pt-2 text-white/90">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px]">schedule</span>
                <p className="text-sm font-semibold">25 min</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px]">bar_chart</span>
                <p className="text-sm font-semibold">Intermediate</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px]">local_fire_department</span>
                <p className="text-sm font-semibold">450 kcal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 relative z-20">
        {/* ActionPanel: AI Tip */}
        <div className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-white dark:bg-zinc-800 dark:border-zinc-700 p-5 shadow-xl shadow-orange-500/5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
                <p className="text-gray-900 dark:text-white text-sm font-bold uppercase tracking-wide">Chef's AI Tip</p>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">This recipe uses the 'blooming' technique for spices found in the video at 02:14 to unlock deeper flavors.</p>
            </div>
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl py-3 px-4 bg-orange-50 dark:bg-orange-500/10 text-primary text-sm font-bold hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors">
            <span className="material-symbols-outlined text-[18px]">play_circle</span>
            <span>Watch Clip</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col px-4 pt-8">
        {/* Ingredients Header & Serving Control */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-end justify-between">
            <h2 className="text-gray-900 dark:text-white text-2xl font-bold leading-tight">Ingredients</h2>
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">8 items</span>
          </div>
          {/* WheelPicker / Serving Toggle */}
          <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button className="flex-1 py-2 rounded-lg text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">1 Serving</button>
            <button className="flex-1 py-2 rounded-lg text-sm font-bold text-primary bg-white dark:bg-zinc-700 shadow-sm transition">2 Servings</button>
            <button className="flex-1 py-2 rounded-lg text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">3 Servings</button>
          </div>
        </div>

        {/* Ingredients List */}
        <div className="flex flex-col gap-3">
          {[
            { name: "Spaghetti", amount: "200g" },
            { name: "Garlic", amount: "3 cloves, minced" },
            { name: "Large Tomatoes", amount: "4 units, diced" },
            { name: "Olive Oil", amount: "1 tbsp" },
            { name: "Fresh Basil", amount: "1 handful" }
          ].map((item, index) => (
            <label key={index} className="group flex items-center gap-4 p-3 rounded-xl border border-transparent bg-white dark:bg-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all cursor-pointer select-none">
              <div className="relative flex items-center justify-center">
                <input className="peer h-6 w-6 cursor-pointer appearance-none rounded-full border-2 border-gray-300 dark:border-zinc-600 checked:border-primary checked:bg-primary transition-all" type="checkbox" />
                <span className="material-symbols-outlined absolute text-white opacity-0 peer-checked:opacity-100 text-[16px] pointer-events-none">check</span>
              </div>
              <div className="flex flex-col flex-1 peer-checked:opacity-50 transition-opacity">
                <span className="text-gray-900 dark:text-white font-semibold text-base">{item.name}</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">{item.amount}</span>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-8 mb-4">
          <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight mb-4">Tools Needed</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {[
              { icon: "skillet", name: "Pan" },
              { icon: "blender", name: "Blender" },
              { icon: "kitchen", name: "Knife" }
            ].map((tool, idx) => (
              <div key={idx} className="flex-shrink-0 flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">{tool.icon}</span>
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Footer with Safe Area Support */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="absolute inset-0 top-10 bg-gradient-to-t from-white via-white to-transparent dark:from-background-dark dark:via-background-dark pointer-events-none h-full"></div>
        <div className="relative px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-12">
          <button 
            onClick={() => navigate('/cooking')}
            className="w-full flex items-center justify-center gap-3 bg-primary text-white rounded-2xl py-4 shadow-lg shadow-primary/40 hover:bg-primary-hover hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <span className="material-symbols-outlined text-3xl">soup_kitchen</span>
            <span className="text-xl font-bold tracking-wide">Start Cooking</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;