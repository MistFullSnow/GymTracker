import React, { useState, useEffect } from 'react';
import { WORKOUT_PLAN } from './constants';
import { WorkoutLog } from './types';
import { saveWorkoutLog } from './services/sheetService';
import { fetchExerciseImages } from './services/gifService';

// --- Icons ---
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;

export default function App() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-dark text-neutral-100 flex flex-col font-sans">
      <header className="px-6 py-5 bg-card/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 flex justify-between items-center shadow-lg shadow-black/40">
        <div>
            <h1 className="text-2xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-fuchsia-300">
            GYMTRACKER<span className="text-white not-italic font-light">.AI</span>
            </h1>
        </div>
        
        {deferredPrompt ? (
          <button 
            onClick={handleInstallClick}
            className="flex items-center gap-2 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/50 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all animate-pulse"
          >
            <DownloadIcon /> Install
          </button>
        ) : (
          <div className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_10px_rgba(45,212,191,0.5)]"></div>
        )}
      </header>

      <main className="flex-grow p-4 pb-12 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full">
            <PlanView setLoading={setLoading} showToast={showToast} />
        </div>
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          <div className="mt-4 font-bold text-primary tracking-widest animate-pulse">PROCESSING...</div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-secondary to-teal-600 text-dark px-8 py-3 rounded-full shadow-2xl shadow-teal-900/50 z-50 font-bold tracking-wide animate-bounce border border-white/10 w-max max-w-[90vw] text-center">
          {toast}
        </div>
      )}
    </div>
  );
}

// --- Sub-Components ---

const PlanView = ({ setLoading, showToast }: { setLoading: (b: boolean) => void, showToast: (s: string) => void }) => {
  const [showAll, setShowAll] = useState(false);

  const getTodayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const todayName = getTodayName();
  const todaysPlan = WORKOUT_PLAN.find(p => p.day === todayName);
  
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
                        <ExerciseItem 
                            key={i} 
                            exercise={ex} 
                            day={plan.day} 
                            isToday={plan.day === todayName} 
                            setLoading={setLoading} 
                            showToast={showToast} 
                        />
                        ))}
                    </ul>
                </div>
                
                {plan.stretches && plan.stretches.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Recovery</h4>
                        <div className="bg-neutral-900/50 rounded-xl p-4 border border-white/5">
                            <ul className="text-xs text-neutral-400 space-y-2">
                                {plan.stretches.map((s: string, i: number) => <li key={i} className="flex gap-2"><span>•</span> {s}</li>)}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
      ))}
      
      {!showAll && todaysPlan && (
           <div className="text-center pt-8 pb-4">
               <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-2">Done for the day?</p>
               <button 
                 onClick={() => showToast("WORKOUT COMPLETE! 🚀")}
                 className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black italic uppercase text-xl py-5 rounded-2xl shadow-lg shadow-emerald-900/50 transition-transform active:scale-95"
               >
                 Finish Workout
               </button>
           </div>
      )}
    </div>
  );
};

const ImageAnimator = ({ images, title }: { images: string[], title: string }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!images || images.length <= 1) return;
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 1000);
        return () => clearInterval(interval);
    }, [images]);

    if (!images || images.length === 0) {
        return (
             <div className="animate-pulse flex items-center justify-center text-xs font-bold uppercase tracking-widest text-neutral-500 h-full w-full py-10 bg-neutral-900/50">
                Visual unavailable
             </div>
        );
    }

    return (
         <img src={images[index]} alt={`${title} demonstration`} className="w-full h-full max-h-56 object-contain mix-blend-screen opacity-90 transition-opacity duration-300 bg-black/60 rounded-lg p-2" />
    );
};

const ExerciseItem = ({ exercise, day, isToday, setLoading, showToast }: any) => {
    const [expanded, setExpanded] = useState(false);
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [setNumber, setSetNumber] = useState(1);
    const [notes, setNotes] = useState('');
    const [images, setImages] = useState<string[] | null>(null);
    const [loadingImages, setLoadingImages] = useState(false);
  
    const handleExpandToggle = async () => {
        if (!isToday) return;
        const willExpand = !expanded;
        setExpanded(willExpand);

        if (willExpand && !images && !loadingImages) {
            setLoadingImages(true);
            const fetchedImages = await fetchExerciseImages(exercise.name);
            setImages(fetchedImages || []); 
            setLoadingImages(false);
        }
    };

    const handleLog = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!weight || !reps) return;
      
      setLoading(true);
      const logInfo = {
        date: new Date().toISOString().split('T')[0],
        day,
        muscleGroup: 'Unknown',
        exercise: exercise.name,
        setNumber,
        weight: parseFloat(weight),
        reps: parseFloat(reps),
        notes
      };
      
      const success = await saveWorkoutLog(logInfo as WorkoutLog);
      setLoading(false);
      
      if (success) {
        showToast(`Logged Set ${setNumber}`);
        setSetNumber(prev => prev + 1);
        setNotes('');
      } else {
        showToast('Error saving to Sheets');
      }
    };
  
    return (
      <li className={`bg-surface p-3 rounded-xl border transition-all ${expanded ? 'border-primary/50 shadow-md shadow-primary/10' : 'border-white/5'}`}>
         <div 
            className={`flex justify-between items-center ${isToday ? 'cursor-pointer' : ''}`} 
            onClick={handleExpandToggle}
         >
             <div>
                 <span className="block font-bold text-neutral-200 text-sm">{exercise.name}</span>
             </div>
             <div className="flex gap-3 items-center">
                <span className="text-xs font-mono font-bold text-white bg-primary/20 px-2 py-1 rounded">{exercise.sets}</span>
                {isToday && (
                    <button className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                )}
             </div>
         </div>
         
         {expanded && (
             <div className="pt-4 mt-3 border-t border-white/5 animate-in slide-in-from-top-2 fade-in duration-200">
                {/* Visual Display */}
                <div className="w-full bg-card rounded-lg overflow-hidden mb-4 border border-white/5 flex justify-center items-center min-h-[140px]">
                    {loadingImages ? (
                         <div className="animate-pulse flex items-center justify-center text-xs font-bold uppercase tracking-widest text-neutral-500 py-10">
                            Loading visual...
                         </div>
                    ) : images && images.length > 0 ? (
                        <ImageAnimator images={images} title={exercise.name} />
                    ) : (
                         <div className="flex flex-col items-center justify-center text-xs font-bold uppercase tracking-widest text-neutral-500 py-10">
                            <span className="text-xl mb-1">🔍</span>
                            No Preview Available
                         </div>
                    )}
                </div>

                <form onSubmit={handleLog} className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest pl-1">Set</label>
                            <input 
                                type="number" 
                                value={setNumber} 
                                onChange={e=>setSetNumber(parseInt(e.target.value))} 
                                className="w-full bg-card p-3 rounded-lg text-white font-mono font-bold border border-white/5 focus:border-primary outline-none" 
                                min="1" max="10" 
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest pl-1">Kg</label>
                            <input 
                                type="number" step="0.5" 
                                value={weight} 
                                onChange={e=>setWeight(e.target.value)} 
                                className="w-full bg-card p-3 rounded-lg text-white font-mono font-bold border border-white/5 focus:border-primary outline-none" 
                                required 
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest pl-1">Reps</label>
                            <input 
                                type="number" 
                                value={reps} 
                                onChange={e=>setReps(e.target.value)} 
                                className="w-full bg-card p-3 rounded-lg text-white font-mono font-bold border border-white/5 focus:border-primary outline-none" 
                                required 
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Notes (optional)" 
                            value={notes} 
                            onChange={e=>setNotes(e.target.value)} 
                            className="flex-1 bg-card p-3 rounded-lg text-white text-xs border border-white/5 focus:border-primary outline-none" 
                        />
                        <button 
                            type="submit" 
                            className="bg-primary/20 text-primary hover:bg-primary border border-primary/50 hover:text-white px-5 rounded-lg font-bold text-xs uppercase tracking-wide transition-all flex items-center gap-1 active:scale-95"
                        >
                            <CheckIcon /> Save
                        </button>
                    </div>
                </form>
             </div>
         )}
      </li>
    );
};
