import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { getUserWellnessLogs, generateInsights } from '../services/wellnessService';
import { WellnessLog, InsightData } from '../types';
import { Activity, History, PlusCircle, TrendingUp } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import WellnessLogForm from '../components/forms/WellnessLogForm';
import HistoryView from '../components/dashboard/HistoryView';

const DashboardPage: React.FC = () => {
  const { authState } = useAuth();
  const [logs, setLogs] = useState<WellnessLog[]>([]);
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const loadUserData = async () => {
    if (!authState.user) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const userLogs = await getUserWellnessLogs(authState.user.username);
      setLogs(userLogs);
      
      const userInsights = generateInsights(userLogs);
      setInsights(userInsights);
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load your wellness data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (authState.user) {
      loadUserData();
    }
  }, [authState.user]);
  
  const getLatestLog = () => {
    if (logs.length === 0) return null;
    return logs.reduce((latest, current) => {
      const latestDate = new Date(latest.date).getTime();
      const currentDate = new Date(current.date).getTime();
      return currentDate > latestDate ? current : latest;
    }, logs[0]);
  };
  
  const latestLog = getLatestLog();
  const today = new Date().toISOString().split('T')[0];
  const hasLoggedToday = latestLog && latestLog.date === today;

  const handleLogSuccess = () => {
    loadUserData();
    setShowForm(false);
  };

  const renderMainContent = () => {
    if (showForm) {
      return <WellnessLogForm onSuccess={handleLogSuccess} />;
    }

    if (showHistory) {
      if (!hasLoggedToday) {
        return (
          <Card className="text-center p-8">
            <Activity className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Complete Today's Log First</h3>
            <p className="text-gray-600 mb-4">
              Please log your wellness data for today before viewing your history.
            </p>
            <Button onClick={() => setShowForm(true)} icon={<PlusCircle className="h-4 w-4" />}>
              Log Today's Wellness
            </Button>
          </Card>
        );
      }
      return <HistoryView logs={logs} />;
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Welcome to Wellness Tracker" className="col-span-full">
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">
                Track your daily wellness metrics to gain insights into your health patterns and make informed decisions about your well-being.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button 
                  onClick={() => setShowForm(true)}
                  icon={<PlusCircle className="h-4 w-4" />}
                  className="flex-1"
                >
                  Log Today's Wellness
                </Button>
                <Button 
                  onClick={() => setShowHistory(true)}
                  variant="outline"
                  icon={<History className="h-4 w-4" />}
                  className="flex-1"
                  disabled={!hasLoggedToday}
                >
                  View History
                </Button>
              </div>
            </div>
          </Card>

          {latestLog && (
            <Card 
              title="Latest Wellness Log" 
              subtitle={`Recorded on ${new Date(latestLog.date).toLocaleDateString()}`}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                    <div className="text-blue-600 dark:text-blue-300 text-sm font-medium mb-1">
                      Sleep Quality
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {latestLog.sleepQuality}/10
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900 p-4 rounded-lg">
                    <div className="text-amber-600 dark:text-amber-300 text-sm font-medium mb-1">
                      Fatigue
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {latestLog.fatigue}/10
                    </div>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
                    <div className="text-red-600 dark:text-red-300 text-sm font-medium mb-1">
                      Soreness
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {latestLog.soreness}/10
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                    <div className="text-purple-600 dark:text-purple-300 text-sm font-medium mb-1">
                      Stiffness
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {latestLog.stiffness}/10
                    </div>
                  </div>
                </div>
                
                {latestLog.notes && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{latestLog.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          <Card title="Quick Insights">
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`
                    p-2 rounded-full flex-shrink-0
                    ${insight.trend === 'improving' ? 'bg-green-100 text-green-600' : ''}
                    ${insight.trend === 'declining' ? 'bg-red-100 text-red-600' : ''}
                    ${insight.trend === 'stable' ? 'bg-blue-100 text-blue-600' : ''}
                  `}>
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{insight.metric}</h4>
                    <p className="text-sm text-gray-600">{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <Header 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode}
        onBack={showForm || showHistory ? () => {
          setShowForm(false);
          setShowHistory(false);
        } : undefined}
      />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {showForm ? "Log Today's Wellness" : 
                 showHistory ? "Wellness History" : 
                 "Wellness Dashboard"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {authState.user ? `Welcome back, ${authState.user.name}` : 'Loading...'}
              </p>
            </div>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            renderMainContent()
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardPage;