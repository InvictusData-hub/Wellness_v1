// This is a mock implementation for the purpose of this example
// In a real application, you would use the Google Sheets API

import { WellnessLog } from '../types';

// Mock data for demonstration purposes
const mockCredentialsData = [
  { Name: 'John Doe', DOB: '1990-01-01', Username: 'johndoe', Password: 'john0101' },
  { Name: 'Jane Smith', DOB: '1985-05-15', Username: 'janesmith', Password: 'jane0515' }
];

const mockWellnessData: WellnessLog[] = [
  { id: '1', userId: 'johndoe', date: '2023-09-01', sleepQuality: 7, soreness: 4, stiffness: 3, fatigue: 5, notes: 'Felt good overall' },
  { id: '2', userId: 'johndoe', date: '2023-09-02', sleepQuality: 8, soreness: 3, stiffness: 3, fatigue: 4, notes: 'Better than yesterday' },
  { id: '3', userId: 'johndoe', date: '2023-09-03', sleepQuality: 6, soreness: 5, stiffness: 4, fatigue: 6, notes: 'Tired after workout' },
  { id: '4', userId: 'janesmith', date: '2023-09-01', sleepQuality: 9, soreness: 2, stiffness: 2, fatigue: 3, notes: 'Great day' },
  { id: '5', userId: 'janesmith', date: '2023-09-02', sleepQuality: 7, soreness: 3, stiffness: 4, fatigue: 4, notes: 'Moderate stress' }
];

export const fetchSheetData = async (sheetName: string): Promise<any[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  switch (sheetName) {
    case 'UserCredentials':
      return [...mockCredentialsData];
    case 'WellnessLogs':
      return [...mockWellnessData];
    default:
      return [];
  }
};

export const fetchUserWellnessLogs = async (userId: string): Promise<WellnessLog[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter wellness logs for the specific user
  const userLogs = mockWellnessData.filter(log => log.userId === userId);
  
  // Sort by date (most recent first)
  return [...userLogs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const appendSheetData = async (
  sheetName: string, 
  data: any
): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log(`Adding data to ${sheetName}:`, data);
  
  // In a real application, this would send data to Google Sheets
  // For demo purposes, we're just logging it
  if (sheetName === 'WellnessLogs') {
    const newLog: WellnessLog = {
      id: String(mockWellnessData.length + 1),
      ...data
    };
    mockWellnessData.push(newLog);
  }
  
  return true;
};

// In a real application, you would implement these functions using the Google Sheets API
// You would need to set up OAuth2 authentication or a service account
// And use appropriate API calls to read/write data to your Google Sheet