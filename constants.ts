import { DailyPlan } from './types';

export const WORKOUT_PLAN: DailyPlan[] = [
  {
    day: 'Monday',
    focus: 'Chest + Triceps',
    color: 'bg-red-500',
    exercises: [
      { name: 'Barbell Chest Press', sets: '3×8–10' },
      { name: 'Incline Chest Press', sets: '3×10' },
      { name: 'Decline Press / Machine', sets: '3×10' },
      { name: 'Pec Fly Machine', sets: '3×12' },
      { name: 'Triceps Pushdown', sets: '3×12' },
      { name: 'Overhead Triceps Extension', sets: '3×10' },
      { name: 'Incline Push-ups', sets: '40–50 reps total' },
    ],
    stretches: [
      'Chest wall stretch – 30s each side',
      'Overhead triceps stretch – 30s each arm',
      'Cross-body shoulder stretch – 30s each',
      'Chest opener – 45s',
      'Neck stretch – 20s each side',
    ],
  },
  {
    day: 'Tuesday',
    focus: 'Back + Biceps',
    color: 'bg-green-500',
    exercises: [
      { name: 'Hammer Lat Machine / Pulldown', sets: '3×10' },
      { name: 'Seated Cable Row', sets: '3×10–12' },
      { name: 'One-arm DB Row', sets: '3×10 each side' },
      { name: 'Face Pulls', sets: '3×15' },
      { name: 'Barbell/DB Curl', sets: '3×10' },
      { name: 'Hammer Curl', sets: '3×12' },
    ],
    stretches: [
      'Overhead lat stretch – 30s each',
      'Hanging bar stretch – 45s',
      'Forward fold – 45s',
      'Cross-body shoulder stretch – 30s',
      'Biceps wall stretch – 30s each',
      'Overhead biceps stretch – 30s each',
    ],
  },
  {
    day: 'Wednesday',
    focus: 'Legs',
    color: 'bg-blue-500',
    exercises: [
      { name: 'Squats', sets: '3×8–10' },
      { name: 'Leg Press', sets: '3×12' },
      { name: 'Leg Extension', sets: '3×12' },
      { name: 'Leg Curl', sets: '3×12' },
      { name: 'Standing Calf Raises', sets: '4×15–20' },
      { name: 'Plank', sets: '2×45s (optional)' },
    ],
    stretches: [
      'Quad stretch – 30s each',
      'Hamstring stretch – 30s each',
      'Calf stretch – 30s each',
      'Hip flexor stretch – 30s each',
      'Glute stretch – 30s each',
    ],
  },
  {
    day: 'Thursday',
    focus: 'Shoulders + Core',
    color: 'bg-yellow-500',
    exercises: [
      { name: 'Shoulder Press', sets: '3×8–10' },
      { name: 'Lateral Raises', sets: '4×12–15' },
      { name: 'Front Raises', sets: '3×12' },
      { name: 'Rear Delt Fly', sets: '3×15' },
      { name: 'Hanging Leg Raises', sets: '3×12' },
      { name: 'Plank', sets: '3×30–45s' },
    ],
    stretches: [
      'Cross-body shoulder stretch – 30s',
      'Triceps stretch – 30s',
      'Chest opener – 45s',
      'Side bend – 30s',
      'Cobra stretch – 30s',
      'Child’s pose – 45s',
    ],
  },
  {
    day: 'Friday',
    focus: 'Upper Body Pump',
    color: 'bg-purple-500',
    exercises: [
      { name: 'Incline Chest Press', sets: '3×12' },
      { name: 'Lat Pulldown (neutral)', sets: '3×12' },
      { name: 'Lateral Raises', sets: '3×15' },
      { name: 'Cable Biceps Curl', sets: '3×12' },
      { name: 'Triceps Rope Pushdown', sets: '3×12' },
      { name: 'Push-ups or Dips', sets: '2 sets near failure' },
    ],
    stretches: [
      'Chest wall stretch',
      'Overhead lat stretch',
      'Cross-body shoulder stretch',
      'Biceps wall stretch',
      'Forward fold',
      'Neck & traps stretch',
    ],
  },
];

export const MUSCLE_GROUPS = [
  'Chest', 'Triceps', 'Back', 'Biceps', 'Legs', 'Shoulders', 'Core'
];
