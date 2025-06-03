import { WellnessLog, InsightData } from '../types';
import { fetchUserWellnessLogs, appendSheetData } from './googleSheetsService';

export const getUserWellnessLogs = async (userId: string): Promise<WellnessLog[]> => {
  return await fetchUserWellnessLogs(userId);
};

export const addWellnessLog = async (logData: Omit<WellnessLog, 'id'>): Promise<boolean> => {
  return await appendSheetData('WellnessLogs', logData);
};

export const generateInsights = (logs: WellnessLog[]): InsightData[] => {
  if (logs.length < 3) {
    return [{
      metric: 'General',
      message: 'Log more entries to see personalized insights.',
      trend: 'stable'
    }];
  }

  const insights: InsightData[] = [];
  const recentLogs = [...logs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);
  
  // Sleep Quality Insight
  const sleepScores = recentLogs.map(log => log.sleepQuality);
  const avgSleep = sleepScores.reduce((sum, score) => sum + score, 0) / sleepScores.length;
  const sleepTrend = determineTrend(sleepScores);
  
  insights.push({
    metric: 'Sleep Quality',
    message: sleepTrend === 'improving' 
      ? 'Your sleep quality has been improving recently.'
      : sleepTrend === 'declining'
      ? 'Your sleep quality has been declining. Consider adjusting your sleep routine.'
      : 'Your sleep quality has been consistent.',
    trend: sleepTrend
  });
  
  // Fatigue Insight
  const fatigueScores = recentLogs.map(log => log.fatigue);
  const avgFatigue = fatigueScores.reduce((sum, score) => sum + score, 0) / fatigueScores.length;
  const fatigueTrend = determineTrend(fatigueScores.reverse()); // Reverse because lower fatigue is better
  
  insights.push({
    metric: 'Fatigue',
    message: fatigueTrend === 'improving' 
      ? 'Your fatigue levels have been decreasing. Great job!'
      : fatigueTrend === 'declining'
      ? 'Your fatigue levels have been increasing. Consider more rest.'
      : 'Your fatigue levels have been stable.',
    trend: fatigueTrend
  });
  
  // Combined Soreness & Stiffness Insight
  const combinedScores = recentLogs.map(log => (log.soreness + log.stiffness) / 2);
  const combinedTrend = determineTrend(combinedScores.reverse()); // Reverse because lower is better
  
  insights.push({
    metric: 'Physical Discomfort',
    message: combinedTrend === 'improving' 
      ? 'Your soreness and stiffness have been improving.'
      : combinedTrend === 'declining'
      ? 'Your soreness and stiffness have been increasing. Consider gentle stretching.'
      : 'Your physical discomfort levels have been consistent.',
    trend: combinedTrend
  });
  
  // Overall Wellness Insight
  const overallScores = recentLogs.map(log => 
    (log.sleepQuality + (11 - log.fatigue) + (11 - log.soreness) + (11 - log.stiffness)) / 4
  );
  const overallTrend = determineTrend(overallScores);
  
  insights.push({
    metric: 'Overall Wellness',
    message: overallTrend === 'improving' 
      ? 'Your overall wellness has been trending positively. Keep it up!'
      : overallTrend === 'declining'
      ? 'Your overall wellness has been declining slightly. Consider reviewing your habits.'
      : 'Your overall wellness has been stable.',
    trend: overallTrend
  });
  
  return insights;
};

const determineTrend = (scores: number[]): 'improving' | 'declining' | 'stable' => {
  if (scores.length < 3) return 'stable';
  
  let improving = 0;
  let declining = 0;
  
  for (let i = 1; i < scores.length; i++) {
    if (scores[i] > scores[i-1]) improving++;
    else if (scores[i] < scores[i-1]) declining++;
  }
  
  if (improving > declining && improving >= scores.length / 2) return 'improving';
  if (declining > improving && declining >= scores.length / 2) return 'declining';
  return 'stable';
};