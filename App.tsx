import React, { useState, useEffect } from 'react';
import { WORKOUT_PLAN, MUSCLE_GROUPS } from './constants';
import { Tab, WorkoutLog, WeeklyAnalysisData } from './types';
import { saveWorkoutLog, getWorkoutLogs } from './services/sheetService';
import { generateWeeklyAnalysis } from './services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

// --- Icons ---
const DumbbellIcon = ({ active }: { active: boolean }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform ${active ? 'scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
const ClipboardIcon = ({ active }: { active: boolean }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform ${active ? 'scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const ChartIcon = ({ active }: { active: boolean }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform ${active ? 'scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const ClockIcon = ({ active }: { active: boolean }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform ${active ? 'scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('plan');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen pb-24 bg-dark text-neutral-100 flex flex-col font-sans">
      <header className="px-6 py-5 bg-card/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 flex justify-between items-center shadow-lg shadow-black/40">
        <div>
            <h1 className="text-2xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-fuchsia-300">
            GYMTRACKER<span className="text-white not-italic font-light">.AI</span>
            </h1>
        </div>
        <div className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_10px_rgba(45,212,191,0.5)]"></div>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full">
            {activeTab === 'plan' && <PlanView onLogClick={() => setActiveTab('log')} />}
            {activeTab === 'log' && <LogView setLoading={setLoading} showToast={showToast} />}
            {activeTab === 'analysis' && <AnalysisView setLoading={setLoading} />}
            {activeTab === 'history' && <HistoryView />}
        </div>
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          <div className="mt-4 font-bold text-primary tracking-widest animate-pulse">PROCESSING</div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-secondary to-teal-600 text-dark px-8 py-3 rounded-full shadow-2xl shadow-teal-900/50 z-50 font-bold tracking-wide animate-bounce border border-white/10">
          {toast}
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-card/95 backdrop-blur-xl border-t border-white/5 flex justify-around p-2 z-40 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <NavBtn icon={<ClipboardIcon active={activeTab === 'plan'} />} label="Plan" active={activeTab === 'plan'} onClick={() => setActiveTab('plan')} />
        <NavBtn icon={<DumbbellIcon active={activeTab === 'log'} />} label="Log" active={activeTab === 'log'} onClick={() => setActiveTab('log')} />
        <NavBtn icon={<ChartIcon active={activeTab === 'analysis'} />} label="Analysis" active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} />
        <NavBtn icon={<ClockIcon active={activeTab === 'history'} />} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
      </nav>
    </div>
  );
}

const NavBtn = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 w-16 ${active ? 'text-primary bg-primary/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'text-neutral-500 hover:text-neutral-300'}`}>
    {icon}
    <span className="text-[10px] font-bold uppercase mt-1 tracking-wider">{label}</span>
  </button>
);

// --- Sub-Components ---

const PlanView = ({ onLogClick }: { onLogClick: () => void }) => {
  const [showAll, setShowAll] = useState(false);

  const getTodayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const todayName = getTodayName();
  const todaysPlan = WORKOUT_PLAN.find(p => p.day === todayName);
  
  // If it's a rest day (not in plan) or user wants to see all
  const displayedPlans = showAll ? WORKOUT_PLAN : (todaysPlan ? [todaysPlan] : []);
  const isRestDay = !todaysPlan && !showAll;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {!showAll && (
        <div className="flex justify-between items-end mb-2">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tight">
                {todayName}'s <span className="text-primary">Plan</span>
            </h2>
            <button 
                onClick={() => setShowAll(true)}
                className="text-xs font-bold text-neutral-400 hover:text-primary transition-colors uppercase tracking-widest border-b border-transparent hover:border-primary pb-0.5"
            >
                Show Full Week
            </button>
        </div>
      )}

      {showAll && (
         <button 
         onClick={() => setShowAll(false)}
         className="mb-4 text-xs font-bold text-primary hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2"
        >
         ← Back to Today
        </button>
      )}

      {isRestDay && (
        <div className="bg-surface rounded-3xl p-8 text-center border border-white/5 shadow-2xl">
            <div className="text-6xl mb-4">🧘</div>
            <h3 className="text-2xl font-bold text-white mb-2">Rest Day</h3>
            <p className="text-neutral-400 mb-6">Recover, hydrate, and prepare for tomorrow.</p>
            <button 
                onClick={() => setShowAll(true)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 px-6 rounded-xl transition-all w-full"
            >
                View Schedule
            </button>
        </div>
      )}

      {displayedPlans.map((plan) => (
        <div key={plan.day} className="group relative bg-card rounded-3xl overflow-hidden shadow-2xl border border-white/5 transition-all hover:border-primary/30">
          {/* Header */}
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-purple-800"></div>
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-6 pl-4">
                <div>
                    <h3 className="font-black text-2xl text-white uppercase tracking-wide">{plan.day}</h3>
                    <div className="inline-block mt-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                        <span className="text-xs font-bold text-secondary tracking-wider uppercase">{plan.focus}</span>
                    </div>
                </div>
            </div>
          
            <div className="pl-4 space-y-6">
                <div>
                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Workout</h4>
                    <ul className="space-y-3">
                        {plan.exercises.map((ex, i) => (
                        <li key={i} className="flex justify-between items-center bg-surface p-3 rounded-xl border border-white/5">
                            <div>
                                <span className="block font-bold text-neutral-200 text-sm">{ex.name}</span>
                            </div>
                            <span className="text-xs font-mono font-bold text-white bg-primary/20 px-2 py-1 rounded">{ex.sets}</span>
                        </li>
                        ))}
                    </ul>
                </div>
                
                {plan.stretches.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Recovery</h4>
                        <div className="bg-neutral-900/50 rounded-xl p-4 border border-white/5">
                            <ul className="text-xs text-neutral-400 space-y-2">
                                {plan.stretches.map((s, i) => <li key={i} className="flex gap-2"><span>•</span> {s}</li>)}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
      ))}
      
      {!showAll && todaysPlan && (
           <button 
           onClick={onLogClick}
           className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-black italic uppercase text-xl py-5 rounded-2xl shadow-lg shadow-purple-900/50 transition-transform active:scale-95"
         >
           Start Workout
         </button>
      )}
    </div>
  );
};

const LogView = ({ setLoading, showToast }: { setLoading: (b: boolean) => void, showToast: (s: string) => void }) => {
  const todayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  
  const [formData, setFormData] = useState<Partial<WorkoutLog>>({
    day: todayName,
    date: new Date().toISOString().split('T')[0],
    setNumber: 1,
    weight: 0,
    reps: 0,
    exercise: '', 
    muscleGroup: 'Chest' // Default, but will be overwritten if user picks from dropdown
  });

  // Group exercises by day for the dropdown
  const groupedExercises = WORKOUT_PLAN.map(day => ({
    day: day.day,
    exercises: day.exercises
  }));

  // Auto-select the first exercise of the day if available
  useEffect(() => {
    const todayPlan = WORKOUT_PLAN.find(p => p.day === todayName);
    if (todayPlan && todayPlan.exercises.length > 0 && !formData.exercise) {
        setFormData(prev => ({ ...prev, exercise: todayPlan.exercises[0].name }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.exercise || !formData.weight || !formData.reps) return;

    setLoading(true);
    // Find muscle group for the selected exercise strictly from constants if possible
    // Simplified logic: Just stick with manual muscle group or infer it? 
    // Let's rely on the user selection or just default it. 
    // For now, we keep the muscle group selection active but optional if they just want to log.
    
    const success = await saveWorkoutLog(formData as WorkoutLog);
    setLoading(false);

    if (success) {
      showToast("SET COMPLETED");
      // Auto increment set number, cap at 5
      const nextSet = (formData.setNumber || 0) < 5 ? (formData.setNumber || 1) + 1 : 1;
      setFormData(prev => ({ 
          ...prev, 
          setNumber: nextSet,
          // Keep weight/reps for convenience
      }));
    } else {
      showToast("Error Saving");
    }
  };

  return (
    <div className="bg-card p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
       <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>

      <h2 className="text-3xl font-black italic text-white mb-6 uppercase">Log <span className="text-primary">Performance</span></h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Exercise Selection Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Exercise</label>
          <div className="relative">
            <select 
                className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none font-bold"
                value={formData.exercise}
                onChange={e => setFormData({...formData, exercise: e.target.value})}
                required
            >
                <option value="" disabled>Select Exercise...</option>
                {/* Show Today's exercises first */}
                {groupedExercises.sort((a,b) => a.day === todayName ? -1 : 1).map(group => (
                    <optgroup key={group.day} label={group.day === todayName ? `${group.day} (TODAY)` : group.day} className="bg-neutral-800 text-neutral-400 font-bold">
                        {group.exercises.map(ex => (
                            <option key={ex.name} value={ex.name} className="text-white py-2">
                                {ex.name}
                            </option>
                        ))}
                    </optgroup>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* Muscle Group (Still useful for data analysis, keep as fallback) */}
        <div className="space-y-2">
             <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Target Muscle</label>
             <div className="flex flex-wrap gap-2">
                 {MUSCLE_GROUPS.slice(0, 5).map(m => (
                     <button
                        key={m}
                        type="button"
                        onClick={() => setFormData({...formData, muscleGroup: m})}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors border ${formData.muscleGroup === m ? 'bg-primary border-primary text-white' : 'bg-surface border-white/5 text-neutral-400 hover:border-white/20'}`}
                     >
                         {m}
                     </button>
                 ))}
             </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Weight (kg)</label>
            <input 
              type="number" step="0.5"
              className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white text-2xl font-black font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={formData.weight || ''}
              onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})}
              placeholder="0"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Reps</label>
            <input 
              type="number"
              className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white text-2xl font-black font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={formData.reps || ''}
              onChange={e => setFormData({...formData, reps: parseFloat(e.target.value)})}
              placeholder="0"
              required
            />
          </div>
        </div>

        {/* Set Number Dropdown */}
        <div className="bg-surface rounded-xl p-2 border border-white/5 flex justify-between items-center">
             <span className="text-sm font-bold text-neutral-400 ml-2">SET NUMBER</span>
             <div className="flex gap-1">
                 {[1, 2, 3, 4, 5].map(num => (
                     <button
                        key={num}
                        type="button"
                        onClick={() => setFormData({...formData, setNumber: num})}
                        className={`w-10 h-10 rounded-lg font-black flex items-center justify-center transition-all ${formData.setNumber === num ? 'bg-white text-dark scale-110 shadow-lg' : 'bg-neutral-800 text-neutral-600'}`}
                     >
                         {num}
                     </button>
                 ))}
             </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Notes</label>
          <textarea 
            className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white h-20 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
            value={formData.notes || ''}
            onChange={e => setFormData({...formData, notes: e.target.value})}
            placeholder="How did it feel?"
          />
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-primary to-purple-600 text-white font-black italic uppercase text-xl py-5 rounded-2xl shadow-lg shadow-purple-900/50 transition-all hover:scale-[1.02] active:scale-95">
          LOG SET
        </button>
      </form>
    </div>
  );
};

const AnalysisView = ({ setLoading }: { setLoading: (b: boolean) => void }) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const runAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const logs = await getWorkoutLogs();
      if (logs.length === 0) {
        setError('No logs found to analyze.');
        setLoading(false);
        return;
      }
      
      const result = await generateWeeklyAnalysis(logs);
      setData(result);
    } catch (e) {
      setError('Analysis failed. Check API Key or Internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!data ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-white/5 shadow-2xl">
          <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h2 className="text-2xl font-black text-white italic uppercase mb-2">Unlock Insights</h2>
          <p className="text-neutral-500 mb-8 max-w-xs mx-auto">Use Gemini AI to analyze your volume, strength gains, and weekly progress.</p>
          <button onClick={runAnalysis} className="bg-white text-dark font-black py-4 px-10 rounded-xl shadow-xl hover:bg-neutral-200 transition-all uppercase tracking-wide">
            Generate Analysis
          </button>
          {error && <p className="text-red-500 mt-6 font-bold bg-red-500/10 py-2 rounded-lg mx-4">{error}</p>}
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in duration-300 space-y-6">
          <div className="bg-gradient-to-br from-card to-neutral-900 p-6 rounded-3xl border border-white/10 shadow-2xl">
            <h3 className="text-lg font-bold text-primary mb-3 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> AI Analysis
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line font-medium">
              {data.summary}
            </p>
          </div>

          <div className="bg-card p-6 rounded-3xl border border-white/10 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Volume (KG)</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.stats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="muscleGroup" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                        cursor={{fill: '#ffffff10'}}
                        contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
                    />
                    <Bar dataKey="totalVolume" radius={[6, 6, 0, 0]}>
                        {data.stats.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#a855f7' : '#2dd4bf'} />
                        ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {data.stats.map((stat: any, i: number) => (
                <div key={i} className="bg-surface p-4 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-20">
                        <ChartIcon active={false} />
                    </div>
                    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">{stat.muscleGroup}</div>
                    <div className="text-2xl font-black text-white">{stat.totalVolume}<span className="text-sm font-medium text-neutral-500 ml-1">kg</span></div>
                    {stat.percentChange !== 0 && (
                        <div className={`text-xs font-bold mt-2 inline-block px-2 py-1 rounded ${stat.percentChange >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {stat.percentChange > 0 ? '▲' : '▼'} {Math.abs(stat.percentChange)}%
                        </div>
                    )}
                </div>
            ))}
          </div>
          
          <button onClick={() => setData(null)} className="w-full py-4 text-neutral-500 hover:text-white font-bold text-sm uppercase tracking-widest transition-colors">
            Close Report
          </button>
        </div>
      )}
    </div>
  );
};

const HistoryView = () => {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);

  useEffect(() => {
    getWorkoutLogs().then(setLogs);
  }, []);

  return (
    <div className="space-y-4">
        <h2 className="text-2xl font-black text-white mb-6 uppercase italic">Recent <span className="text-secondary">Activity</span></h2>
        {logs.length === 0 && (
            <div className="text-center py-20 opacity-50">
                <div className="text-4xl mb-4">📜</div>
                <p>No logs recorded yet.</p>
            </div>
        )}
        <div className="space-y-3">
            {logs.map((log, i) => (
                <div key={i} className="bg-card p-5 rounded-2xl border border-white/5 flex justify-between items-center hover:border-white/20 transition-colors shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-surface flex items-center justify-center text-xs font-bold text-neutral-400 border border-white/5">
                            {log.setNumber}
                        </div>
                        <div>
                            <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-0.5">{log.muscleGroup}</div>
                            <div className="font-bold text-white text-lg leading-tight">{log.exercise}</div>
                            <div className="text-xs text-neutral-500 mt-1">{new Date(log.date).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-black text-white font-mono">{log.weight}<span className="text-sm text-neutral-500 font-sans ml-1">kg</span></div>
                        <div className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full inline-block mt-1">{log.reps} reps</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
