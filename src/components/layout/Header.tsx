import React, { useState } from 'react';
import { Menu, X, User, LogOut, Sun, Moon, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode, onBack }) => {
  const { authState, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo and title */}
          <div className="flex items-center">
            {onBack && (
              <button
                onClick={onBack}
                className="mr-2 p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Sun className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Wellness Tracker</span>
            </div>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {authState.isAuthenticated && authState.user && (
              <div className="ml-4 relative flex-shrink-0">
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    className="flex items-center text-sm"
                    onClick={logout}
                    icon={<LogOut className="h-4 w-4" />}
                  >
                    Sign Out
                  </Button>
                  
                  <div className="ml-3 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {authState.user.name}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200">
          <div className="space-y-1 pt-2 pb-3 px-4">
            {authState.isAuthenticated && authState.user && (
              <div className="py-3 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{authState.user.name}</div>
                    <div className="text-sm font-medium text-gray-500">{authState.user.username}</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isDarkMode ? (
                  <div className="flex items-center">
                    <Sun className="h-5 w-5" />
                    <span className="ml-2">Light Mode</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Moon className="h-5 w-5" />
                    <span className="ml-2">Dark Mode</span>
                  </div>
                )}
              </button>
            </div>
            
            {authState.isAuthenticated && (
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-center"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  icon={<LogOut className="h-4 w-4" />}
                >
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;