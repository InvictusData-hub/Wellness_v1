import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoginPage from '../../pages/LoginPage';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authState } = useAuth();
  
  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return authState.isAuthenticated && authState.user ? (
    <>{children}</>
  ) : (
    <LoginPage />
  );
};

export default ProtectedRoute;