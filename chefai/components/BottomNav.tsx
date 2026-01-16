import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 z-50 w-full max-w-md border-t border-gray-100 dark:border-white/5 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-lg pb-safe">
      <div className="grid h-16 grid-cols-4 items-center">
        <button 
          onClick={() => navigate('/dashboard')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${isActive('/dashboard') ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
        >
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: isActive('/dashboard') ? "'FILL' 1" : "'FILL' 0" }}>home</span>
          <span className="text-[10px] font-bold">Home</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">kitchen</span>
          <span className="text-[10px] font-medium">Pantry</span>
        </button>
        
        <button 
          onClick={() => navigate('/shopping-list')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${isActive('/shopping-list') ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
        >
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: isActive('/shopping-list') ? "'FILL' 1" : "'FILL' 0" }}>shopping_cart</span>
          <span className="text-[10px] font-medium">Shop</span>
        </button>
        
        <button 
           onClick={() => navigate('/premium')}
           className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">person</span>
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>
      {/* iOS Home Indicator spacer if needed, typically handled by OS/Padding but kept for design match */}
      <div className="h-1.5 w-full flex justify-center pb-2">
        <div className="h-1.5 w-32 rounded-full bg-black/20 dark:bg-white/20"></div>
      </div>
    </div>
  );
};

export default BottomNav;