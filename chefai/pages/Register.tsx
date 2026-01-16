import React from 'react';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      {/* Header / Navigation */}
      <div className="flex items-center p-4 pb-2 justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 text-[#161b0d] dark:text-[#f0f2eb] transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-6 pt-2 pb-6">
        <div className="mb-8">
          <h1 className="text-[#161b0d] dark:text-[#f0f2eb] text-[32px] font-bold leading-tight tracking-tight mb-2">
            Create Your Account
          </h1>
          <p className="text-[#4f5b42] dark:text-[#a8b39e] text-base font-medium leading-normal">
            Join the kitchen of the future.
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
          <div className="space-y-2">
            <label className="text-[#161b0d] dark:text-[#f0f2eb] text-sm font-semibold tracking-wide ml-1">Full Name</label>
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Chef John Doe"
                className="peer w-full h-14 rounded-xl border border-[#dde7cf] dark:border-[#323d26] bg-[#fafcf8] dark:bg-[#242e19] text-[#161b0d] dark:text-[#f0f2eb] placeholder:text-[#4f5b42]/60 dark:placeholder:text-[#a8b39e]/50 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none transition-all text-base font-medium"
              />
              <span className="material-symbols-outlined absolute left-4 text-[#4f5b42] dark:text-[#a8b39e] peer-focus:text-primary transition-colors pointer-events-none text-xl">person</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[#161b0d] dark:text-[#f0f2eb] text-sm font-semibold tracking-wide ml-1">Email Address</label>
            <div className="relative flex items-center">
              <input 
                type="email" 
                placeholder="name@example.com"
                className="peer w-full h-14 rounded-xl border border-[#dde7cf] dark:border-[#323d26] bg-[#fafcf8] dark:bg-[#242e19] text-[#161b0d] dark:text-[#f0f2eb] placeholder:text-[#4f5b42]/60 dark:placeholder:text-[#a8b39e]/50 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none transition-all text-base font-medium"
              />
              <span className="material-symbols-outlined absolute left-4 text-[#4f5b42] dark:text-[#a8b39e] peer-focus:text-primary transition-colors pointer-events-none text-xl">mail</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[#161b0d] dark:text-[#f0f2eb] text-sm font-semibold tracking-wide ml-1">Password</label>
            <div className="relative flex items-center">
              <input 
                type="password" 
                placeholder="••••••••"
                className="peer w-full h-14 rounded-xl border border-[#dde7cf] dark:border-[#323d26] bg-[#fafcf8] dark:bg-[#242e19] text-[#161b0d] dark:text-[#f0f2eb] placeholder:text-[#4f5b42]/60 dark:placeholder:text-[#a8b39e]/50 pl-12 pr-12 focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none transition-all text-base font-medium"
              />
              <span className="material-symbols-outlined absolute left-4 text-[#4f5b42] dark:text-[#a8b39e] peer-focus:text-primary transition-colors pointer-events-none text-xl">lock</span>
              <button type="button" className="absolute right-4 flex items-center justify-center text-[#4f5b42] dark:text-[#a8b39e] hover:text-[#161b0d] dark:hover:text-[#f0f2eb] focus:outline-none">
                <span className="material-symbols-outlined text-xl">visibility_off</span>
              </button>
            </div>
          </div>

          <div className="flex items-start mt-2">
            <div className="relative flex items-center h-5">
              <input 
                type="checkbox" 
                className="peer h-5 w-5 rounded border-[#dde7cf] dark:border-[#323d26] text-primary focus:ring-primary bg-[#fafcf8] dark:bg-[#242e19] cursor-pointer transition-colors"
              />
            </div>
            <label className="ml-3 text-sm text-[#4f5b42] dark:text-[#a8b39e]">
               I agree to the <a href="#" className="font-bold text-primary hover:underline">Terms of Service</a> and <a href="#" className="font-bold text-primary hover:underline">Privacy Policy</a>.
            </label>
          </div>

          <div className="h-4"></div>

          <button type="submit" className="w-full h-14 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white text-lg font-bold tracking-wide">Sign Up</span>
          </button>
        </form>
      </main>

      <footer className="p-6 text-center">
        <p className="text-[#4f5b42] dark:text-[#a8b39e] text-base">
          Already have an account? <span className="font-bold text-primary hover:text-primary-hover ml-1 transition-colors cursor-pointer" onClick={() => navigate('/login')}>Log In</span>
        </p>
      </footer>
    </div>
  );
};

export default Register;