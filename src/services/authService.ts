import { User } from '../types';
import { fetchSheetData, appendSheetData } from './googleSheetsService';

const CREDENTIALS_SHEET_NAME = 'UserCredentials';

export const authenticateUser = async (username: string, password: string): Promise<boolean> => {
  try {
    // Fetch user credentials from Google Sheets
    const credentials = await fetchSheetData(CREDENTIALS_SHEET_NAME);
    
    // Find the user with the matching username
    const user = credentials.find((user: any) => 
      user.Username.toLowerCase() === username.toLowerCase()
    );
    
    // If user exists and password matches, return true
    if (user && user.Password === password) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
};

export const getUserData = async (username: string): Promise<User> => {
  try {
    // Fetch user data from Google Sheets
    const credentials = await fetchSheetData(CREDENTIALS_SHEET_NAME);
    
    // Find the user with the matching username
    const userData = credentials.find((user: any) => 
      user.Username.toLowerCase() === username.toLowerCase()
    );
    
    if (!userData) {
      throw new Error('User not found');
    }
    
    // Map Google Sheets data to User type
    return {
      id: userData.Username, // Using username as ID for simplicity
      name: userData.Name,
      username: userData.Username,
      dob: userData.DOB
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const generatePassword = (name: string, dob: string): string => {
  // Simple algorithm to generate password from name and DOB
  const namePart = name.replace(/\s/g, '').toLowerCase().slice(0, 4);
  const dobPart = dob.replace(/[^\d]/g, '').slice(-4);
  
  return `${namePart}${dobPart}`;
};