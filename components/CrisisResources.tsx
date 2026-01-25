
import React from 'react';
import { CRISIS_RESOURCES } from '../constants';

const CrisisResources: React.FC = () => {
  return (
    <div className="p-4 md:p-8 h-full bg-slate-50 overflow-y-auto custom-scrollbar pb-24 md:pb-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <section className="bg-red-50 border border-red-100 rounded-[2.5rem] p-8 md:p-10 text-center shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl" aria-hidden="true">🚨</span>
          </div>
          <h2 className="text-3xl font-black text-red-900 mb-4 tracking-tight">You're not alone.</h2>
          <p className="text-red-800 text-lg leading-relaxed mb-10 font-medium">
            If you are in immediate danger or having thoughts of self-harm, please reach out for help right now. These services in India are free, confidential, and available 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:14416"
              className="bg-red-600 text-white px-8 py-5 rounded-2xl font-black text-xl hover:bg-red-700 transition-all shadow-xl shadow-red-200 active:scale-95 flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📞</span> 14416 (Tele MANAS)
            </a>
            <a 
              href="tel:9152987821"
              className="bg-white text-red-600 border-2 border-red-600 px-8 py-5 rounded-2xl font-black text-xl hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📞</span> iCall Support
            </a>
          </div>
        </section>

        <section className="space-y-6">
          <div className="px-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">National Helplines (India)</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Free and confidential support available throughout the country.</p>
          </div>
          
          <div className="grid gap-4">
            {CRISIS_RESOURCES.map((res, idx) => (
              <a 
                key={idx}
                href={res.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50/50 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{res.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-indigo-500 font-black text-sm">{res.contact}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">24/7 Support</span>
                  </div>
                </div>
                <div className="bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white text-slate-500 font-black text-[11px] px-6 py-2.5 rounded-xl uppercase tracking-widest transition-all">
                  Visit Site
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="bg-indigo-900 p-8 rounded-[2rem] text-white/90 text-center border border-indigo-800 shadow-2xl overflow-hidden relative group">
          <div className="relative z-10">
            <p className="text-lg md:text-xl font-medium leading-relaxed italic mb-2">
              "Healing takes time, and asking for help is a courageous first step. You are valued, and you are needed."
            </p>
            <div className="w-12 h-1 bg-indigo-400 rounded-full mx-auto mt-6"></div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/10 rounded-full -ml-16 -mb-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        </section>

        <div className="text-center pb-12">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-4">MINDA • Verified Resources 2024</p>
            <div className="flex justify-center gap-6">
                 <button className="text-[10px] text-slate-400 hover:text-indigo-600 font-bold uppercase tracking-widest underline underline-offset-4 transition-colors">Privacy Policy</button>
                 <button className="text-[10px] text-slate-400 hover:text-indigo-600 font-bold uppercase tracking-widest underline underline-offset-4 transition-colors">Terms of Use</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisResources;
