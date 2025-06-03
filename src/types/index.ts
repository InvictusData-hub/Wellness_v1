export interface User {
  id: string;
  name: string;
  username: string;
  dob: string;
}

export interface WellnessLog {
  id: string;
  userId: string;
  date: string;
  sleepQuality: number;
  soreness: number;
  stiffness: number;
  fatigue: number;
  notes?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface InsightData {
  metric: string;
  message: string;
  trend: 'improving' | 'declining' | 'stable';
}