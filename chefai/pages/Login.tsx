import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] rounded-full bg-primary/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] rounded-full bg-primary/5 blur-[100px] pointer-events-none"></div>

      {/* Main Content Container */}
      <div className="flex flex-1 flex-col justify-center items-center px-6 py-8 w-full max-w-md mx-auto z-10">
        
        {/* Header Section */}
        <div className="w-full text-center mb-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/20">
            <span className="material-symbols-outlined text-4xl">skillet</span>
          </div>
          <h1 className="text-[#1c100d] dark:text-white tracking-tight text-[32px] font-bold leading-tight pb-3">
            Welcome Back!
          </h1>
          <p className="text-[#9c5749] dark:text-[#dcbdb8] text-base font-normal leading-normal px-4">
            Let's get cooking. Log in to access your saved recipes.
          </p>
        </div>

        {/* Login Form */}
        <form className="w-full space-y-5" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
          <div className="flex flex-col gap-1.5">
            <label className="text-[#1c100d] dark:text-white text-sm font-medium leading-normal ml-1">Email</label>
            <div className="relative">
              <input 
                type="email" 
                placeholder="hello@example.com"
                className="w-full rounded-xl text-[#1c100d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#e8d3ce] dark:border-[#4a2e26] bg-white dark:bg-[#2f1f1c] focus:border-primary h-14 placeholder:text-[#9c5749]/60 dark:placeholder:text-[#9c5749] p-[15px] text-base font-normal leading-normal shadow-sm transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#1c100d] dark:text-white text-sm font-medium leading-normal ml-1">Password</label>
            <div className="relative flex w-full items-center rounded-xl bg-white dark:bg-[#2f1f1c] border border-[#e8d3ce] dark:border-[#4a2e26] shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password"
                className="flex-1 w-full bg-transparent border-none focus:ring-0 text-[#1c100d] dark:text-white h-14 placeholder:text-[#9c5749]/60 dark:placeholder:text-[#9c5749] pl-[15px] pr-2 text-base font-normal leading-normal rounded-l-xl"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center justify-center p-3 pr-4 text-[#9c5749] hover:text-primary transition-colors focus:outline-none rounded-r-xl"
              >
                <span className="material-symbols-outlined text-2xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <a href="#" className="text-primary text-sm font-medium hover:underline transition-all">
              Forgot Password?
            </a>
          </div>

          <button className="w-full bg-primary hover:bg-[#d92a08] text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="relative w-full py-8 flex items-center">
          <div className="flex-grow border-t border-[#e8d3ce] dark:border-[#4a2e26]"></div>
          <span className="flex-shrink-0 mx-4 text-[#9c5749] text-sm font-medium">Or continue with</span>
          <div className="flex-grow border-t border-[#e8d3ce] dark:border-[#4a2e26]"></div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <button className="flex items-center justify-center gap-3 h-14 rounded-xl border border-[#e8d3ce] dark:border-[#4a2e26] bg-white dark:bg-[#2f1f1c] hover:bg-[#fcf9f8] dark:hover:bg-[#3d2925] text-[#1c100d] dark:text-white font-medium transition-all shadow-sm active:scale-[0.98]">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"></path>
              <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3275 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"></path>
              <path d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z" fill="#FBBC05"></path>
              <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335"></path>
            </svg>
            Google
          </button>
          <button className="flex items-center justify-center gap-3 h-14 rounded-xl border border-[#e8d3ce] dark:border-[#4a2e26] bg-white dark:bg-[#2f1f1c] hover:bg-[#fcf9f8] dark:hover:bg-[#3d2925] text-[#1c100d] dark:text-white font-medium transition-all shadow-sm active:scale-[0.98]">
             <svg className="w-6 h-6 text-[#1c100d] dark:text-white fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.05 20.28C15.93 21.91 14.65 23.95 12.59 23.95C10.58 23.92 10.06 22.75 7.84 22.75C5.62 22.75 4.98 23.92 3.14 23.97C1.16 24 0 22.08 0 20.37C0 17.37 2 13.56 5.86 13.56C7.75 13.59 9.04 14.77 10.13 14.77C11.14 14.77 12.79 13.43 14.96 13.43C15.82 13.45 18.3 13.78 19.8 15.96C19.68 16.03 17.07 17.58 17.05 20.28ZM11.96 0C13.06 0.08 14.63 0.88 15.42 2.05C16.32 3.39 16.08 5.48 14.83 6.64C13.68 7.76 11.97 8.05 11.08 7.91C11.08 5.37 13.3 3.01 15.01 1.96C14.28 0.72 13.08 0.12 11.96 0Z"></path>
            </svg>
            Apple
          </button>
        </div>

        {/* Footer Section */}
        <div className="mt-8 text-center">
          <p className="text-[#9c5749] text-sm">
            Don't have an account? <span className="text-primary font-bold hover:underline cursor-pointer" onClick={() => navigate('/register')}>Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;