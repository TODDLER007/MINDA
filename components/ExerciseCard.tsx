
import React, { useState, useEffect, useRef } from 'react';
import { EXERCISES } from '../constants';
import { Exercise } from '../types';

interface ExerciseListProps {
  onStartWithAI: (message: string) => void;
}

const BoxBreathingGuide: React.FC<{ onEnd: () => void }> = ({ onEnd }) => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const timerRef = useRef<number | null>(null);

  const phases = {
    Inhale: { next: 'Hold', color: 'bg-blue-500', text: 'Breathe In...', icon: '↗️' },
    Hold: { next: 'Exhale', color: 'bg-indigo-500', text: 'Hold...', icon: '⏸️' },
    Exhale: { next: 'Pause', color: 'bg-purple-500', text: 'Breathe Out...', icon: '↘️' },
    Pause: { next: 'Inhale', color: 'bg-slate-500', text: 'Hold...', icon: '⏸️' }
  } as const;

  const speak = (text: string) => {
    if (isMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isActive) {
      speak(phases[phase].text);
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setPhase((currentPhase) => {
              const nextPhase = phases[currentPhase].next;
              speak(phases[nextPhase].text);
              return nextPhase;
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phase, isMuted]);

  return (
    <div 
      className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl animate-in zoom-in-95 duration-500"
      role="region"
      aria-label="Box Breathing Exercise"
    >
      <div 
        className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center mb-8"
        aria-live="assertive"
        aria-atomic="true"
      >
        <span className="sr-only">{phases[phase].text} - {timeLeft} seconds remaining</span>
        
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-slate-200 rounded-full opacity-20"></div>
        
        {/* Breathing Circle */}
        <div 
          className={`absolute transition-all duration-[1000ms] ease-linear rounded-full shadow-2xl flex items-center justify-center ${phases[phase].color} ${
            isActive 
              ? phase === 'Inhale' ? 'scale-100 opacity-100' : 
                phase === 'Hold' ? 'scale-100 opacity-90' :
                phase === 'Exhale' ? 'scale-50 opacity-100' : 
                'scale-50 opacity-80'
              : 'scale-75 opacity-50'
          }`}
          style={{ width: '100%', height: '100%' }}
          aria-hidden="true"
        >
          <div className="text-white text-center">
             <div className="text-4xl md:text-5xl font-black mb-1">{timeLeft}</div>
             <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-80">{phase === 'Pause' ? 'Hold' : phase}</div>
          </div>
        </div>

        {/* Phase Indicator */}
        <div 
          className="absolute -top-4 bg-white px-4 py-2 rounded-full shadow-md border border-slate-100 flex items-center gap-2"
          aria-hidden="true"
        >
          <span className="text-xl">{phases[phase].icon}</span>
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider">{phases[phase].text}</span>
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-xs">
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg focus:ring-4 outline-none active:scale-95 ${
            isActive ? 'bg-red-500 text-white focus:ring-red-200' : 'bg-indigo-600 text-white focus:ring-indigo-200'
          }`}
          aria-label={isActive ? "Stop breathing exercise" : "Start breathing exercise"}
        >
          {isActive ? 'Stop' : 'Start Timer'}
        </button>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="p-4 bg-white border border-slate-200 rounded-2xl text-xl shadow-sm hover:bg-slate-50 focus:ring-2 focus:ring-slate-100 outline-none transition-colors"
          aria-label={isMuted ? "Unmute voice cues" : "Mute voice cues"}
          title={isMuted ? "Unmute" : "Mute Cues"}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>
      
      <button 
        onClick={onEnd}
        className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 focus:outline-none underline decoration-slate-200 underline-offset-4"
        aria-label="Exit breathing exercise"
      >
        Exit Exercise
      </button>
    </div>
  );
};

const ExerciseList: React.FC<ExerciseListProps> = ({ onStartWithAI }) => {
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);

  const startWithAI = (ex: Exercise) => {
    onStartWithAI(`Can you guide me through the "${ex.title}" exercise? I'd like some help with ${ex.category.toLowerCase()}.`);
  };

  return (
    <div className="p-4 md:p-8 h-full bg-[#fafbff] overflow-y-auto custom-scrollbar pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="animate-in fade-in slide-in-from-left-4 duration-500">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Mindfulness Tools</h2>
          <p className="text-slate-500 font-medium">Simple exercises to help you find calm.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list">
          {EXERCISES.map((ex: Exercise) => (
            <div 
              key={ex.id} 
              role="listitem"
              className={`relative bg-white rounded-[2rem] p-6 md:p-8 border-2 transition-all duration-300 shadow-sm ${
                activeExerciseId === ex.id ? 'border-indigo-500 shadow-lg' : 'border-transparent hover:border-slate-100'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                  ex.category === 'Breathing' ? 'bg-blue-50 text-blue-600' :
                  ex.category === 'Grounding' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-purple-50 text-purple-600'
                }`}>
                  {ex.category}
                </span>
                <span className="text-slate-400 text-[10px] font-bold" aria-label={`Duration: ${ex.duration}`}>{ex.duration}</span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-2">{ex.title}</h3>
              
              {activeExerciseId === ex.id && ex.id === 'box-breathing' ? (
                <BoxBreathingGuide onEnd={() => setActiveExerciseId(null)} />
              ) : (
                <>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">{ex.description}</p>

                  <div className="space-y-3 mb-8">
                    {ex.instructions.map((step, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <span className="w-5 h-5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0 mt-0.5" aria-hidden="true">{idx + 1}</span>
                        <span className="text-sm text-slate-600 font-medium">{step}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => startWithAI(ex)}
                      className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 focus:ring-4 focus:ring-indigo-100 outline-none"
                      aria-label={`Ask AI to guide you through ${ex.title}`}
                    >
                      💬 Guide me (AI)
                    </button>
                    <button 
                      onClick={() => setActiveExerciseId(activeExerciseId === ex.id ? null : ex.id)}
                      className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 focus:ring-2 focus:ring-slate-100 outline-none transition-all"
                      aria-label={activeExerciseId === ex.id ? `Stop ${ex.title}` : `Start ${ex.title} solo`}
                    >
                      {activeExerciseId === ex.id ? 'End Practice' : 'Start Solo'}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="bg-indigo-900 rounded-[2.5rem] p-8 md:p-12 text-white text-center shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-3">Custom Meditation?</h3>
            <p className="text-indigo-200 mb-8 max-w-md mx-auto font-medium">
              Ask MINDA for a personalized session tailored to exactly how you feel right now.
            </p>
            <button 
              onClick={() => onStartWithAI("I'd like to do a custom meditation session. Can you help me?")}
              className="bg-white text-indigo-900 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 focus:ring-4 focus:ring-white/20 outline-none transition-all active:scale-95 shadow-xl"
            >
              Start AI Session
            </button>
          </div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseList;
