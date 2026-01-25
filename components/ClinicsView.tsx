
import React, { useState, useEffect } from 'react';
import { geminiService, LocationData } from '../services/geminiService';

interface ClinicsViewProps {
  onContactPro: (message: string) => void;
}

const ClinicsView: React.FC<ClinicsViewProps> = ({ onContactPro }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const findHelp = async (loc: LocationData) => {
    setLoading(true);
    setError(null);
    try {
      const prompt = "Find 5 licensed mental health clinics, therapists, or psychiatrists near my current location. Provide their names, addresses, and a brief description of their services.";
      const stream = geminiService.sendMessageStream(prompt, [], loc);
      
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk;
        setResults(fullText);
      }
    } catch (err: any) {
      console.error(err);
      setError("I couldn't find local results right now. Please check your internet or location settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setLocation(loc);
          findHelp(loc);
        },
        (err) => {
          setError("Location access is required to find clinics near you. Please enable location permissions.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  return (
    <div className="p-4 md:p-8 h-full bg-slate-50 overflow-y-auto custom-scrollbar pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="animate-in fade-in slide-in-from-top-4 duration-500">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Find Help Nearby</h2>
          <p className="text-slate-500 font-medium">Connecting you with licensed professional support in your area.</p>
        </header>

        {error && (
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] text-center animate-in zoom-in-95 duration-300">
            <span className="text-3xl block mb-4">📍</span>
            <p className="text-amber-800 font-bold mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-amber-600 text-white px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-amber-700 transition-all shadow-md active:scale-95"
            >
              Retry
            </button>
          </div>
        )}

        {loading && !results && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl">🔍</span>
            </div>
            <p className="text-indigo-600 font-black text-[11px] uppercase tracking-[0.2em]">Searching for local care...</p>
          </div>
        )}

        {results && (
          <div className="space-y-6 animate-in fade-in duration-700">
            <div className="bg-white border border-slate-100 p-6 md:p-10 rounded-[2.5rem] shadow-sm">
              <div className="prose prose-slate max-w-none">
                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base font-medium">
                  {results}
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 p-8 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-100">
              <div className="text-center md:text-left">
                <h4 className="font-black text-lg mb-1 uppercase tracking-tight">Need help deciding?</h4>
                <p className="text-indigo-100 text-sm opacity-90">Talk to MINDA about which type of professional might be right for you.</p>
              </div>
              <button 
                onClick={() => onContactPro("I've found some clinics nearby. Can you help me understand the difference between a therapist, a psychiatrist, and a counselor so I can choose the right one?")}
                className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95 whitespace-nowrap shadow-lg"
              >
                Ask MINDA
              </button>
            </div>
          </div>
        )}

        <footer className="text-center pt-8 border-t border-slate-200">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-sm mx-auto">
            Disclaimer: MINDA provides information but does not endorse specific providers. Always verify credentials with local medical boards.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ClinicsView;
