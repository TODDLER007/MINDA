
import React from 'react';
import MascotLogo from './MascotLogo';

interface LandingPageProps {
  onStart: (name: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const handleStartClick = () => {
    onStart('Friend');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-gradient-to-br from-[#f5f7ff] via-white to-[#fdf2ff] overflow-y-auto">
      <div className="w-full max-w-sm bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(79,70,229,0.08)] p-8 md:p-12 flex flex-col items-center animate-in fade-in zoom-in-95 duration-700 my-auto border border-slate-50">
        
        {/* Responsive Logo */}
        <div className="mb-8 md:mb-10 hover:scale-105 transition-transform duration-500">
          <MascotLogo size={160} />
        </div>

        {/* Title & Description */}
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">MINDA</h1>
        <p className="text-center text-slate-500 text-sm md:text-base leading-relaxed mb-10 px-4 font-medium">
          Your safe, private space to talk about mental health. No sign-up, just support.
        </p>

        <button
          onClick={handleStartClick}
          className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all duration-300 uppercase tracking-widest text-sm"
        >
          Begin Conversation
        </button>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-slate-50 w-full flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            Private & Anonymous
          </div>
          <p className="text-[9px] text-slate-300 font-medium text-center max-w-[200px]">
            By starting, you access 24/7 AI-powered emotional support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
