import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-background-dark pb-safe">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCoxBsywBe-w6v3I8KuCIcXGgrzg7ui9Yp-xMLJwSF0wJRAGm7kzKaluE5PDq8PQZZMsYuQDadosLE11Jg3YulTd8kHfAP6vOGvzsthc1jiIE9eSr9pOFMiUFfaVKhBohjeDCwVLZ7cKQCn229bQF0-yAN96ICN498PMBio-5doKvNpLKcBg9rI4jybBGdGFw26TUmfLyC0U_vF93IlLHpyvmJAzBRJFa7B-GoQRSjEDkvIvVpn1sc_VzgTS7nfr1vPk8WNKfJA9lc')` }}
        ></div>
        {/* Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/90"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col h-full w-full px-6 pt-safe pb-8 justify-between">
        {/* Top Section: Logo & Branding */}
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-10">
          <div className="mb-6 rounded-full bg-white/20 p-4 backdrop-blur-sm border border-white/10 animate-fade-in-up">
            <span className="material-symbols-outlined text-4xl text-primary">restaurant_menu</span>
          </div>
          <h1 className="text-white text-5xl font-extrabold tracking-tight leading-tight mb-4 drop-shadow-sm">
            Recipe App
          </h1>
          <p className="text-gray-200 text-lg font-medium leading-relaxed max-w-[280px] drop-shadow-sm">
            Turn videos into delicious recipes instantly with AI magic.
          </p>
        </div>

        {/* Bottom Section: Actions */}
        <div className="w-full flex flex-col gap-4 max-w-md mx-auto mb-6">
          <button 
            onClick={() => navigate('/register')}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-primary h-14 px-6 text-white shadow-lg transition-transform active:scale-[0.98] hover:bg-primary-hover"
          >
            <span className="text-lg font-bold tracking-wide mr-2">Get Started</span>
            <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
          
          <button 
            onClick={() => navigate('/login')}
            className="flex w-full items-center justify-center rounded-xl h-14 px-6 border border-white/30 bg-white/10 backdrop-blur-md text-white transition-colors active:bg-white/20 hover:bg-white/20 hover:border-white/50"
          >
            <span className="text-lg font-bold tracking-wide">Sign In</span>
          </button>
          
          <p className="text-center text-xs text-gray-400 mt-4 font-normal">
            By continuing, you agree to our <a href="#" className="underline hover:text-white transition-colors">Terms</a> & <a href="#" className="underline hover:text-white transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;