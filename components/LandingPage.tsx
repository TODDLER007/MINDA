
import React, { useState } from 'react';
import MascotLogo from './MascotLogo';

interface LandingPageProps {
  onStart: (name: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-gradient-to-br from-[#f5f7ff] via-white to-[#fdf2ff] overflow-y-auto">
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(79,70,229,0.08)] p-8 md:p-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-700 my-auto">
        
        {/* Responsive Logo */}
        <div className="mb-6 md:mb-8 hover:scale-105 transition-transform duration-500">
          <MascotLogo size={window.innerHeight < 600 ? 100 : 140} />
        </div>

        {/* Title & Description */}
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight">MINDA</h1>
        <p className="text-center text-slate-500 text-sm md:text-[15px] leading-relaxed mb-8 md:mb-10 px-2 font-medium">
          A safe, private space to talk about your mental health. We're here to listen, 24/7.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
              Your Name or Nickname
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sam"
              required
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-slate-800 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all text-base outline-none font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all duration-300 uppercase tracking-widest text-xs md:text-sm"
          >
            Start Conversation
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-50 w-full flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            Private & Anonymous
          </div>
          <p className="text-[9px] text-slate-300 font-medium text-center">
            By starting, you agree to our community guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
