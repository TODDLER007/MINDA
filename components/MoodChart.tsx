
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoodEntry } from '../types';

interface MoodTrackerProps {
  onDiscussMood: (message: string) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ onDiscussMood }) => {
  const [entries, setEntries] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('serenity_mood_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { date: 'Mon', score: 3 },
      { date: 'Tue', score: 2 },
      { date: 'Wed', score: 4 },
      { date: 'Thu', score: 4 },
      { date: 'Fri', score: 5 },
      { date: 'Sat', score: 4 },
      { date: 'Sun', score: 3 },
    ];
  });

  const [todayScore, setTodayScore] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('serenity_mood_data', JSON.stringify(entries));
  }, [entries]);

  const handleMoodSelect = (score: number) => {
    setTodayScore(score);
    // Auto-save when a mood is clicked to remove the "Log" button bar
    saveEntry(score);
  };

  const saveEntry = (score: number) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const newEntry: MoodEntry = { 
      date: today, 
      score: score
    };
    
    setEntries((prev) => {
      const updated = [...prev];
      if (updated[updated.length - 1].date === today) {
        updated[updated.length - 1] = newEntry;
        return [...updated];
      }
      return [...updated.slice(1), newEntry];
    });
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const discussCurrentMood = () => {
    const moodLabel = ['awful', 'poor', 'okay', 'good', 'great'][todayScore! - 1];
    let msg = `I just logged that I'm feeling ${moodLabel}. Can we talk about this?`;
    onDiscussMood(msg);
  };

  const moodEmojis = ['😢', '😔', '😐', '🙂', '😊'];
  const labels = ['Awful', 'Poor', 'Okay', 'Good', 'Great'];
  const averageMood = (entries.reduce((acc, curr) => acc + curr.score, 0) / entries.length).toFixed(1);

  return (
    <div className="p-4 md:p-8 h-full bg-[#fdfdfd] overflow-y-auto custom-scrollbar pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <section className="text-center animate-in fade-in slide-in-from-top-4 duration-500">
          <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">How are you feeling right now?</h2>
          <p className="text-slate-400 mb-10 max-w-lg mx-auto font-medium">Your mood history helps MINDA personalize your support.</p>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
            {moodEmojis.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => handleMoodSelect(idx + 1)}
                className={`group flex flex-col items-center gap-3 p-5 md:p-7 rounded-[2.5rem] transition-all duration-300 border-2 ${
                  todayScore === idx + 1 
                    ? 'bg-indigo-600 border-indigo-600 shadow-xl scale-110' 
                    : 'bg-white border-slate-100 hover:border-indigo-100 shadow-sm'
                }`}
              >
                <span className="text-4xl md:text-5xl">{emoji}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${todayScore === idx + 1 ? 'text-white' : 'text-slate-400'}`}>
                  {labels[idx]}
                </span>
              </button>
            ))}
          </div>

          {showSuccess && (
            <div className="animate-in slide-in-from-bottom-4 bg-indigo-50 border border-indigo-100 p-8 rounded-[3rem] max-w-md mx-auto shadow-sm">
              <p className="text-indigo-700 font-black uppercase tracking-widest text-xs mb-6">Mood Logged! ✨</p>
              <button 
                onClick={discussCurrentMood}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto"
              >
                <span>Discuss with MINDA</span>
                <span className="text-lg">💬</span>
              </button>
            </div>
          )}
        </section>

        <section className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-800">Weekly Progress</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Mood trends over the last 7 days</p>
            </div>
            <div className="bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100">
              <span className="text-3xl font-black text-indigo-600 tracking-tighter">{averageMood}</span>
              <span className="text-[10px] text-indigo-400 font-black uppercase ml-2 tracking-widest">Avg</span>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={entries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={15} />
                <YAxis hide domain={[0, 6]} />
                <Tooltip cursor={{ stroke: '#e2e8f0' }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={6} dot={{ r: 8, fill: '#4f46e5', stroke: '#fff', strokeWidth: 3 }} activeDot={{ r: 10, fill: '#4f46e5', stroke: '#fff', strokeWidth: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MoodTracker;
