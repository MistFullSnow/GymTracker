import { WorkoutLog, WeeklyAnalysisData } from '../types';

// Users will input this in the UI if not set in ENV
let SCRIPT_URL = process.env.VITE_GOOGLE_SCRIPT_URL || '';

export const setScriptUrl = (url: string) => {
  SCRIPT_URL = url;
  localStorage.setItem('gym_script_url', url);
};

export const getScriptUrl = () => {
  return SCRIPT_URL || localStorage.getItem('gym_script_url') || '';
};

export const saveWorkoutLog = async (log: WorkoutLog): Promise<boolean> => {
  const url = getScriptUrl();
  if (!url) throw new Error("Script URL not configured");

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'logWorkout', data: log }),
    });
    const res = await response.json();
    return res.status === 'success';
  } catch (error) {
    console.error('Error saving log:', error);
    return false;
  }
};

export const getWorkoutLogs = async (): Promise<WorkoutLog[]> => {
  const url = getScriptUrl();
  if (!url) return [];

  try {
    // Append a query param to avoid caching
    const response = await fetch(`${url}?action=getLogs&t=${Date.now()}`);
    const res = await response.json();
    if (res.status === 'success') {
      return res.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching logs:', error);
    return [];
  }
};

export const saveWeeklyAnalysis = async (analysis: WeeklyAnalysisData): Promise<boolean> => {
  const url = getScriptUrl();
  if (!url) return false;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ action: 'saveAnalysis', data: analysis }),
    });
    const res = await response.json();
    return res.status === 'success';
  } catch (error) {
    console.error('Error saving analysis:', error);
    return false;
  }
};
