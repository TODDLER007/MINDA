
import React from 'react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: ViewState.CHAT, label: 'Chat', icon: '💬' },
    { id: ViewState.TRACKER, label: 'Mood', icon: '📈' },
    { id: ViewState.CLINICS, label: 'Clinics', icon: '📍' },
    { id: ViewState.RESOURCES, label: 'Help', icon: '🚨' },
  ];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MINDA - Mental Health Companion',
          text: 'Check out MINDA, a safe space to talk about mental health.',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex items-center justify-around px-2 py-3 md:hidden z-50 pb-safe shadow-[0_-1px_10px_rgba(0,0,0,0.02)]"
      aria-label="Mobile Navigation"
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          aria-label={`Go to ${item.label} view`}
          aria-current={currentView === item.id ? 'page' : undefined}
          className={`flex flex-col items-center gap-1 px-4 py-1 transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-indigo-100 rounded-xl ${
            currentView === item.id
              ? 'text-indigo-600 scale-110'
              : 'text-slate-400'
          }`}
        >
          <span className="text-xl" aria-hidden="true">{item.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {item.label}
          </span>
          {currentView === item.id && (
            <div className="absolute -bottom-1 w-1 h-1 bg-indigo-600 rounded-full"></div>
          )}
        </button>
      ))}
      <button
        onClick={handleShare}
        className="flex flex-col items-center gap-1 px-4 py-1 text-slate-400 transition-all duration-300 rounded-xl"
        aria-label="Share App"
      >
        <span className="text-xl" aria-hidden="true">📤</span>
        <span className="text-[10px] font-bold uppercase tracking-widest">Share</span>
      </button>
    </nav>
  );
};

export default BottomNav;
