
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
  const [journalNote, setJournalNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('serenity_mood_data', JSON.stringify(entries));
  }, [entries]);

  const handleMoodSelect = (score: number) => {
    setTodayScore(score);
  };

  const saveEntry = () => {
    if (todayScore === null) return;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const newEntry: MoodEntry = { 
      date: today, 
      score: todayScore,
      note: journalNote
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
    let msg = `I just logged that I'm feeling ${moodLabel}.`;
    if (journalNote) msg += ` I noted: "${journalNote}". Can we talk about this?`;
    onDiscussMood(msg);
  };

  const moodEmojis = ['😢', '😔', '😐', '🙂', '😊'];
  const labels = ['Awful', 'Poor', 'Okay', 'Good', 'Great'];
  const averageMood = (entries.reduce((acc, curr) => acc + curr.score, 0) / entries.length).toFixed(1);

  return (
    <div className="p-4 md:p-8 h-full bg-white overflow-y-auto custom-scrollbar pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <section className="text-center animate-in fade-in slide-in-from-top-4 duration-500">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">How are you feeling today?</h2>
          <p className="text-slate-500 mb-8 max-w-lg mx-auto">Tracking your mood helps MINDA understand you better.</p>
          
          <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-8">
            {moodEmojis.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => handleMoodSelect(idx + 1)}
                className={`group flex flex-col items-center gap-2 p-4 md:p-5 rounded-3xl transition-all duration-300 border-2 ${
                  todayScore === idx + 1 
                    ? 'bg-indigo-600 border-indigo-600 shadow-xl scale-110' 
                    : 'bg-white border-slate-100 hover:border-indigo-200 shadow-sm'
                }`}
              >
                <span className="text-3xl md:text-4xl">{emoji}</span>
                <span className={`text-[10px] font-bold uppercase ${todayScore === idx + 1 ? 'text-white' : 'text-slate-400'}`}>
                  {labels[idx]}
                </span>
              </button>
            ))}
          </div>

          {todayScore !== null && !showSuccess && (
            <div className="animate-in zoom-in-95 duration-200 max-w-md mx-auto">
              <textarea
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                placeholder="What's contributing to this feeling?"
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-4 min-h-[100px] text-sm"
              />
              <button onClick={saveEntry} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all">
                Log My Mood
              </button>
            </div>
          )}

          {showSuccess && (
            <div className="animate-in slide-in-from-bottom-4 bg-emerald-50 border border-emerald-100 p-6 rounded-3xl max-w-md mx-auto">
              <p className="text-emerald-700 font-bold mb-4">Mood Logged Successfully! ✨</p>
              <button 
                onClick={discussCurrentMood}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <span>💬 Discuss this with MINDA</span>
              </button>
            </div>
          )}
        </section>

        <section className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-800">Your Progress</h3>
            <div className="bg-indigo-50 px-4 py-2 rounded-2xl">
              <span className="text-2xl font-black text-indigo-600">{averageMood}</span>
              <span className="text-[10px] text-indigo-400 font-bold uppercase ml-2 tracking-tighter">Avg Score</span>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={entries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={15} />
                <YAxis hide domain={[0, 6]} />
                <Tooltip cursor={{ stroke: '#e2e8f0' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={5} dot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MoodTracker;
