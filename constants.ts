import { DailyPlan } from './types';

export const WORKOUT_PLAN: DailyPlan[] = [
  {
    day: 'Monday',
    focus: 'Back + Biceps (Heavy)',
    color: 'bg-green-500',
    exercises: [
      { name: 'Romanian Deadlift', sets: '3×8–10' },
      { name: 'Lat Pulldown (Wide/Normal)', sets: '3×10' },
      { name: 'Seated Cable Row', sets: '3×10–12' },
      { name: 'One Arm Dumbbell Row', sets: '2×10 each side' },
      { name: 'Face Pull', sets: '3×15' },
      { name: 'Dumbbell / Barbell Curl', sets: '3×10' },
      { name: 'Hammer Curl', sets: '3×12' },
    ],
    stretches: [
      'Overhead lat stretch',
      'Forward fold',
      'Biceps wall stretch'
    ],
  },
  {
    day: 'Tuesday',
    focus: 'Chest + Triceps (Heavy)',
    color: 'bg-red-500',
    exercises: [
      { name: 'Barbell Bench Press', sets: '3×8–10' },
      { name: 'Incline Press (DB/Barbell)', sets: '3×10' },
      { name: 'Chest Press Machine', sets: '3×10' },
      { name: 'Pec Fly Machine', sets: '3×12' },
      { name: 'Rope Pushdown', sets: '3×12' },
      { name: 'Overhead Dumbbell Extension', sets: '3×10' },
      { name: 'Incline Push-ups (Finisher)', sets: '30–50 reps total' },
    ],
    stretches: [
      'Chest wall stretch',
      'Overhead triceps stretch'
    ],
  },
  {
    day: 'Wednesday',
    focus: 'Legs + Shoulders',
    color: 'bg-blue-500',
    exercises: [
      { name: 'Squats', sets: '3×8–10' },
      { name: 'Leg Press', sets: '3×12' },
      { name: 'Walking Lunges / Step-Ups', sets: '2×10 each leg' },
      { name: 'Leg Curl', sets: '3×12' },
      { name: 'Standing Calf Raises', sets: '4×15–20' },
      { name: 'Shoulder Press Machine / DB', sets: '3×10' },
      { name: 'Lateral Raises', sets: '3-4×8–12' },
      { name: 'Rear Delt Fly / Reverse Pec Deck', sets: '3×15' },
      { name: 'Dumbbell Shrugs', sets: '3×12–15' },
      { name: 'Plank', sets: '3×30–45s' },
      { name: 'Leg Raises', sets: '3×10–12' },
    ],
    stretches: [
      'Quad & Hamstring stretch',
      'Cross-body shoulder stretch'
    ],
  },
  {
    day: 'Thursday',
    focus: 'Back + Biceps (Light)',
    color: 'bg-yellow-500',
    exercises: [
      { name: 'Close Grip / Hammer Lat Pulldown', sets: '3×12' },
      { name: 'Cable Row (Different Grip)', sets: '3×12' },
      { name: 'Straight Arm Pulldown', sets: '3×12' },
      { name: 'Face Pull', sets: '3×15' },
      { name: 'Incline Dumbbell Curl', sets: '3×10' },
      { name: 'Cable Curl', sets: '3×12' },
    ],
    stretches: [
      'Overhead lat stretch',
      'Biceps wall stretch'
    ],
  },
  {
    day: 'Friday',
    focus: 'Chest + Triceps (Light)',
    color: 'bg-purple-500',
    exercises: [
      { name: 'Incline Chest Press', sets: '3×12' },
      { name: 'Flat Machine Chest Press', sets: '3×12' },
      { name: 'Cable Fly', sets: '3×15' },
      { name: 'Rope Pushdown', sets: '3×12' },
      { name: 'Assisted Dips / Bench Dips', sets: '2 sets to failure' },
      { name: 'Push-ups', sets: '2 sets to failure' },
    ],
    stretches: [
      'Chest wall stretch',
      'Triceps stretch'
    ],
  },
];

export const MUSCLE_GROUPS = [
  'Chest', 'Triceps', 'Back', 'Biceps', 'Legs', 'Shoulders', 'Core'
];
