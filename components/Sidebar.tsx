
import React from 'react';
import { ViewState } from '../types';
import MascotLogo from './MascotLogo';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: ViewState.CHAT, label: 'Therapy Chat', icon: '💬' },
    { id: ViewState.TRACKER, label: 'Mood Log', icon: '📈' },
    { id: ViewState.EXERCISES, label: 'Mindfulness', icon: '🧘' },
    { id: ViewState.CLINICS, label: 'Find Clinics', icon: '📍' },
    { id: ViewState.RESOURCES, label: 'Crisis Help', icon: '🚨' },
    { id: ViewState.ABOUT, label: 'About Us', icon: 'ℹ️' },
  ];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MINDA - Mental Health Companion',
          text: 'I found this helpful mental health companion called MINDA. It offers AI-powered support, mood tracking, and mindfulness exercises.',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('App link copied to clipboard!');
    }
  };

  return (
    <aside 
      className="hidden md:flex w-72 bg-white border-r border-slate-100 flex-col h-screen shrink-0 z-40"
      aria-label="Desktop Navigation Sidebar"
    >
      <div className="p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="hover:rotate-12 transition-transform duration-300">
            <MascotLogo size={48} aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
            MINDA
          </h1>
        </div>
        <div className="h-1 w-12 bg-indigo-600 rounded-full mb-2"></div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Your Mind Matters</p>
      </div>

      <nav className="flex-1 px-4 py-4 overflow-y-auto custom-scrollbar" aria-label="Main Navigation">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setView(item.id)}
                aria-current={currentView === item.id ? 'page' : undefined}
                className={`w-full flex items-center gap-4 px-6 py-4 text-[15px] font-bold rounded-2xl transition-all duration-300 focus:ring-2 focus:ring-indigo-300 outline-none ${
                  currentView === item.id
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-1'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <span className="text-xl" aria-hidden="true">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={handleShare}
              className="w-full flex items-center gap-4 px-6 py-4 text-[15px] font-bold rounded-2xl transition-all duration-300 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 focus:ring-2 focus:ring-indigo-300 outline-none"
            >
              <span className="text-xl" aria-hidden="true">📤</span>
              Share App
            </button>
          </li>
        </ul>
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100" role="complementary" aria-labelledby="tip-heading">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg" aria-hidden="true">💡</span>
            <span id="tip-heading" className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Self-Care Tip</span>
          </div>
          <p className="text-[13px] text-slate-500 font-medium leading-relaxed italic">
            "You don't have to control your thoughts. You just have to stop letting them control you."
          </p>
        </div>
        
        <div className="mt-6 flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" aria-hidden="true"></div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tight">Encrypted & Private</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
