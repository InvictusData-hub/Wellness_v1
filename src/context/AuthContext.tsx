import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { authenticateUser, getUserData } from '../services/authService';

interface AuthContextProps {
  authState: AuthState;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('wellness_user');
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } catch (error) {
        localStorage.removeItem('wellness_user');
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    setAuthState({ ...authState, isLoading: true, error: null });
    
    try {
      const isAuthenticated = await authenticateUser(username, password);
      
      if (isAuthenticated) {
        const userData = await getUserData(username);
        
        // Store user data in localStorage
        localStorage.setItem('wellness_user', JSON.stringify(userData));
        
        setAuthState({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        setAuthState({
          ...authState,
          isLoading: false,
          error: 'Invalid username or password'
        });
      }
    } catch (error) {
      setAuthState({
        ...authState,
        isLoading: false,
        error: 'Authentication failed. Please try again.'
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('wellness_user');
    setAuthState(initialAuthState);
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};