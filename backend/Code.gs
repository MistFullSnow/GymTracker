// THIS IS THE BACKEND CODE. COPY TO GOOGLE APPS SCRIPT.

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; // Replace with actual ID

function doGet(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    const action = e.parameter.action;
    const ss = SpreadsheetApp.openById(SHEET_ID);
    
    if (action === 'getLogs') {
      const sheet = ss.getSheetByName('WorkoutLogs');
      if (!sheet) return jsonResponse({ status: 'error', message: 'Sheet not found' });
      
      const data = sheet.getDataRange().getValues();
      const headers = data.shift(); // Remove headers
      
      const logs = data.map(row => ({
        date: row[0],
        day: row[1],
        muscleGroup: row[2],
        exercise: row[3],
        setNumber: row[4],
        weight: row[5],
        reps: row[6],
        notes: row[7]
      })).reverse(); // Newest first
      
      return jsonResponse({ status: 'success', data: logs });
    }
    
    return jsonResponse({ status: 'error', message: 'Invalid action' });
  } catch (e) {
    return jsonResponse({ status: 'error', message: e.toString() });
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const body = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    
    if (body.action === 'logWorkout') {
      let sheet = ss.getSheetByName('WorkoutLogs');
      if (!sheet) {
        sheet = ss.insertSheet('WorkoutLogs');
        sheet.appendRow(['Date', 'Day', 'MuscleGroup', 'Exercise', 'SetNumber', 'WeightKg', 'Reps', 'Notes']);
      }
      
      const d = body.data;
      sheet.appendRow([d.date, d.day, d.muscleGroup, d.exercise, d.setNumber, d.weight, d.reps, d.notes]);
      return jsonResponse({ status: 'success' });
    }
    
    if (body.action === 'saveAnalysis') {
       let sheet = ss.getSheetByName('WeeklyAnalysis');
      if (!sheet) {
        sheet = ss.insertSheet('WeeklyAnalysis');
        sheet.appendRow(['WeekNumber', 'MuscleGroup', 'TotalVolume', 'AvgWeight', 'MaxWeight', 'TotalSets', 'Summary']);
      }
      
      const d = body.data;
      sheet.appendRow([d.weekNumber, d.muscleGroup, d.totalVolume, d.avgWeight, d.maxWeight, d.totalSets, d.summary]);
      return jsonResponse({ status: 'success' });
    }

    return jsonResponse({ status: 'error', message: 'Unknown action' });
  } catch (e) {
    return jsonResponse({ status: 'error', message: e.toString() });
  } finally {
    lock.releaseLock();
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function setup() {
  // Run this once to initialize sheets
  const ss = SpreadsheetApp.openById(SHEET_ID);
  if (!ss.getSheetByName('WorkoutLogs')) {
     ss.insertSheet('WorkoutLogs').appendRow(['Date', 'Day', 'MuscleGroup', 'Exercise', 'SetNumber', 'WeightKg', 'Reps', 'Notes']);
  }
  if (!ss.getSheetByName('WeeklyAnalysis')) {
     ss.insertSheet('WeeklyAnalysis').appendRow(['WeekNumber', 'MuscleGroup', 'TotalVolume', 'AvgWeight', 'MaxWeight', 'TotalSets', 'Summary']);
  }
}