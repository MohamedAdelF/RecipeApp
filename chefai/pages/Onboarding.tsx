import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNwpqVSNoygmZGU1dn0NigHdJMkf0t7kohx-bdZuvCVvQBKrfjdmKefjlEYtuOe7Ds_Q7svOlKDB3RNn9bj5ptuULOF8HBPo7G9jtIhIQlT9zkjk30d_BbjvztcZSshhcTK0MMoLEK6qSncWDzTwXAfukZlaasBbiopKBT_sz7DMGUUpwDhNYnF-OBVmG1v9fDxTWOfx9hG1ETXQHFaQWO2squt_rtTnhnQ8sJee-WdYUtSOeOgAP3cdhQELsL2WMQGDXby7fkTWk",
    title: "Paste Any Video",
    description: "Found a delicious recipe on TikTok or YouTube? Just paste the link here.",
    overlay: "bg-gradient-to-t from-black/20 to-transparent"
  },
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD565gA2Ncm_T8Z22LoaGuxjg562DcPCWs7sj0oO2e7o1dhqlsI3bxc0eqs4h7s4CIu1UbliX-3YV50uo5JhIfC57u8V0j_uogAf-1nuc6fJNthc70eeKDXf1BK2nbwtpU-noxKLRDS204iPvcguDrL3zO2dFSsM30dB12_ZPMPJG4G3Wi-xEJgOYc5F6vrbptpkK1u_vg_I0Mdn76rIro2qUXvpRIN5lLqlTko0Q9n4i3M_wZXxucFMNLqGPuME7lz6Sb97mEOhfY",
    title: "AI Magic Extraction",
    description: "Our AI instantly converts the video into a clear, step-by-step ingredient list.",
    overlay: "bg-primary/10 mix-blend-overlay"
  },
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmx96cCafgddnO1TAmfng4FQnBCayWVuMy9-s0Av3isFqj4w06abyrl2Z8pJ9uU-fvlk-eEAMqwRKR_dxiCVUizr7R-5FuhoGi0h8OjwTIE6fYMcN8AuEf7RbQiqhqUS9FUwRd1Fa4Jrk3T7AkfFtJGWplLn543KmT67ndajrAUSyCQ_8d4-_8DGTno3HyvhveEyyJfVlLkJEvz8FyDWYQVYzs6fTgI-anPALG5bljgwXFUK25Z6guf-CfLIwjNjAYGeEFzr49oSM",
    title: "Cook Hands-Free",
    description: "Follow along with voice commands. No more touching your screen with messy hands.",
    overlay: "bg-gradient-to-tr from-primary/5 to-transparent"
  }
];

const Onboarding: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(curr => curr + 1);
    } else {
      navigate('/welcome');
    }
  };

  const handleSkip = () => {
    navigate('/welcome');
  };

  return (
    <div className="relative flex h-[100dvh] w-full flex-col max-w-md mx-auto shadow-2xl overflow-hidden bg-background-light dark:bg-background-dark pb-safe">
      {/* Top Navigation */}
      <div className="absolute top-0 right-0 z-20 w-full p-6 pt-safe flex justify-end items-center pointer-events-none mt-4">
        <button 
          onClick={handleSkip}
          className="pointer-events-auto text-primary/80 hover:text-primary text-base font-bold leading-normal tracking-[0.015em] transition-colors duration-200"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 pt-20">
        <div className="w-full aspect-[4/5] max-h-[50vh] bg-cover bg-center rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] mb-10 relative overflow-hidden group transition-all duration-500 ease-in-out" 
             style={{ backgroundImage: `url("${slides[currentSlide].image}")` }}>
          <div className={`absolute inset-0 ${slides[currentSlide].overlay}`}></div>
        </div>
        
        <div className="text-center space-y-3 max-w-[280px] animate-fade-in-up">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
            {slides[currentSlide].title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed">
            {slides[currentSlide].description}
          </p>
        </div>
      </div>

      {/* Bottom Actions Section */}
      <div className="w-full bg-background-light dark:bg-background-dark px-6 pb-10 pt-4 flex flex-col items-center gap-8 z-10">
        {/* Indicators */}
        <div className="flex flex-row items-center justify-center gap-3">
          {slides.map((_, index) => (
            <div 
              key={index} 
              className={`h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-primary' : 'w-2.5 bg-slate-200 dark:bg-slate-700'}`}
            ></div>
          ))}
        </div>

        {/* Main CTA Button */}
        <button 
          onClick={handleNext}
          className="group w-full relative flex items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white text-lg font-bold leading-normal tracking-wide shadow-lg shadow-primary/30 transition-transform active:scale-[0.98]"
        >
          <span className="relative z-10 flex items-center gap-2">
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
      </div>
    </div>
  );
};

export default Onboarding;