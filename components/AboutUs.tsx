
import React from 'react';
import MascotLogo from './MascotLogo';

const AboutUs: React.FC = () => {
  return (
    <div className="p-4 md:p-8 h-full bg-[#fcfdff] overflow-y-auto custom-scrollbar pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex justify-center mb-6">
            <MascotLogo size={120} className="hover:rotate-12 transition-transform duration-500" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">About MINDA</h2>
          <div className="h-1.5 w-16 bg-indigo-600 rounded-full mx-auto"></div>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
            Democratizing compassionate mental health support for every individual, starting with India.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl" aria-hidden="true">🎯</div>
            <h3 className="text-xl font-bold text-slate-800">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed text-sm font-medium">
              MINDA (Mental Intelligence & Nuanced Digital Assistant) was born from a simple realization: professional help is often expensive and hard to access. Our mission is to bridge that gap by providing a 24/7 empathetic companion that helps users navigate daily stress, track their emotional well-being, and learn evidence-based coping skills.
            </p>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl" aria-hidden="true">🧠</div>
            <h3 className="text-xl font-bold text-slate-800">Advanced AI Technology</h3>
            <p className="text-slate-600 leading-relaxed text-sm font-medium">
              MINDA is powered by state-of-the-art Large Language Models (Gemini 2.5 and 3 series). Unlike standard chatbots, MINDA is fine-tuned with a specific "system instruction" to prioritize empathy, safety, and evidence-based psychological frameworks like CBT (Cognitive Behavioral Therapy) and Mindfulness.
            </p>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl" aria-hidden="true">🛡️</div>
            <h3 className="text-xl font-bold text-slate-800">Privacy by Design</h3>
            <p className="text-slate-600 leading-relaxed text-sm font-medium">
              We believe your mental health data is sacred. MINDA uses "Local-First" storage, meaning your chat history and mood logs are stored directly on your device's browser, not on our servers. When we process your requests via AI, your data is transmitted securely and is never used to build advertising profiles.
            </p>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl" aria-hidden="true">🇮🇳</div>
            <h3 className="text-xl font-bold text-slate-800">Indian Context</h3>
            <p className="text-slate-600 leading-relaxed text-sm font-medium">
              Cultural nuances matter. MINDA is uniquely calibrated for the Indian context—understanding social dynamics, academic/workplace pressures in India, and providing immediate access to local resources like Tele MANAS and national helplines.
            </p>
          </section>
        </div>

        <section className="bg-indigo-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-6 text-center max-w-2xl mx-auto">
            <h3 className="text-3xl font-black">Safety First</h3>
            <p className="text-indigo-100 text-lg font-medium leading-relaxed">
              While MINDA is a powerful tool for emotional support and self-care, it is <strong>not</strong> a replacement for clinical therapy or emergency services. In times of crisis, we always point you toward human professionals and national helplines.
            </p>
            <div className="pt-4">
              <span className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-xs font-black uppercase tracking-widest">
                Version 1.2.0 • 2024
              </span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
        </section>

        <div className="text-center space-y-4 pb-8">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Designed with ❤️ for a Healthier Mind</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
