let cachedDb: any[] | null = null;
const DB_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';
const IMG_BASE_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

// Map our custom names to DB names for better reliability
const EXERCISE_ALIASES: Record<string, string> = {
  'romanian deadlift': 'romanian deadlift',
  'lat pulldown (wide/normal)': 'cable pulldown',
  'seated cable row': 'cable seated row',
  'one arm dumbbell row': 'dumbbell row',
  'face pull': 'cable face pull',
  'dumbbell / barbell curl': 'dumbbell curl',
  'barbell bench press': 'barbell bench press',
  'incline press (db/barbell)': 'dumbbell incline bench press',
  'chest press machine': 'lever seated chest press',
  'pec fly machine': 'lever machine pec deck fly',
  'rope pushdown': 'cable triceps pushdown (v-bar)',
  'overhead dumbbell extension': 'dumbbell standing triceps extension',
  'incline push-ups (finisher)': 'incline push-up',
  'squats': 'barbell squat',
  'leg press': 'sled leg press',
  'walking lunges / step-ups': 'dumbbell lunge',
  'leg curl': 'lever lying leg curl',
  'standing calf raises': 'smith standing calf raise',
  'shoulder press machine / db': 'dumbbell seated shoulder press',
  'lateral raises': 'dumbbell lateral raise',
  'rear delt fly / reverse pec deck': 'lever reverse pec deck fly',
  'dumbbell shrugs': 'dumbbell shrug',
  'plank': 'front plank',
  'leg raises': 'hanging leg raise',
  'close grip / hammer lat pulldown': 'cable close grip pulldown',
  'cable row (different grip)': 'cable seated row',
  'straight arm pulldown': 'cable straight arm pulldown',
  'incline dumbbell curl': 'dumbbell incline curl',
  'cable curl': 'cable curl',
  'incline chest press': 'lever incline chest press',
  'flat machine chest press': 'lever seated chest press',
  'cable fly': 'cable fly',
  'assisted dips / bench dips': 'bench dip',
  'push-ups': 'push-up'
};

export const fetchExerciseImages = async (exerciseName: string): Promise<string[] | null> => {
  if (!cachedDb) {
    try {
      const res = await fetch(DB_URL);
      if (res.ok) {
        cachedDb = await res.json();
      }
    } catch (err) {
      console.error("Failed to fetch exercise database", err);
      return null;
    }
  }

  if (!cachedDb) return null;

  const rawName = exerciseName.toLowerCase().trim();
  const searchName = EXERCISE_ALIASES[rawName] || rawName;

  const searchWords = searchName.split(' ').filter(w => w.length > 2);
  
  let bestMatch = null;
  let bestScore = 0;

  for (const ex of cachedDb) {
    const dbName = ex.name.toLowerCase();
    
    // Direct exact match
    if (dbName === searchName) {
      bestMatch = ex;
      break;
    }

    let score = 0;
    for (const word of searchWords) {
      if (dbName.includes(word)) score += 1;
    }

    // Heuristics to boost more precise matches
    if (score > 0 && Math.abs(dbName.length - searchName.length) < 10) {
      score += 0.5; 
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = ex;
    }
  }

  // Fallback to ensuring at least 1 word matches
  if (!bestMatch || bestScore < 1) {
    return null;
  }

  if (bestMatch && bestMatch.images && bestMatch.images.length > 0) {
    return bestMatch.images.map((imgPart: string) => `${IMG_BASE_URL}${imgPart}`);
  }

  return null;
};
