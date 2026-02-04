export interface Exercise {
  name: string;
  sets: string;
  notes?: string;
}

export interface DailyPlan {
  day: string;
  focus: string;
  color: string;
  exercises: Exercise[];
  stretches: string[];
}

export interface WorkoutLog {
  date: string; // ISO string
  day: string;
  muscleGroup: string;
  exercise: string;
  setNumber: number;
  weight: number;
  reps: number;
  notes: string;
}

export interface WeeklyAnalysisData {
  weekNumber: number;
  muscleGroup: string;
  totalVolume: number;
  avgWeight: number;
  maxWeight: number;
  totalSets: number;
  summary: string;
}

export type Tab = 'plan' | 'log' | 'analysis' | 'history';
