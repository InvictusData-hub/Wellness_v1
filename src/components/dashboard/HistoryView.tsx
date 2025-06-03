import React, { useState } from 'react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { WellnessLog, InsightData } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import WellnessChart from './WellnessChart';
import WellnessInsights from './WellnessInsights';
import { generateInsights } from '../../services/wellnessService';

interface HistoryViewProps {
  logs: WellnessLog[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ logs }) => {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  
  const getFilteredLogs = () => {
    const today = new Date();
    let filteredLogs: WellnessLog[];
    
    if (viewMode === 'week') {
      const sevenDaysAgo = subDays(today, 7);
      filteredLogs = logs.filter(log => 
        new Date(log.date) >= sevenDaysAgo && new Date(log.date) <= today
      );
    } else {
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);
      filteredLogs = logs.filter(log => 
        new Date(log.date) >= monthStart && new Date(log.date) <= monthEnd
      );
    }
    
    return filteredLogs.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const filteredLogs = getFilteredLogs();
  const insights = generateInsights(filteredLogs);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button
            variant={viewMode === 'week' ? 'primary' : 'outline'}
            onClick={() => setViewMode('week')}
            size="sm"
          >
            Last 7 Days
          </Button>
          <Button
            variant={viewMode === 'month' ? 'primary' : 'outline'}
            onClick={() => setViewMode('month')}
            size="sm"
          >
            This Month
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WellnessChart
          logs={filteredLogs}
          title="Sleep Quality"
          metric="sleepQuality"
          color="#3B82F6"
        />
        
        <WellnessChart
          logs={filteredLogs}
          title="Fatigue"
          metric="fatigue"
          color="#F59E0B"
        />
        
        <WellnessChart
          logs={filteredLogs}
          title="Soreness"
          metric="soreness"
          color="#EF4444"
        />
        
        <WellnessChart
          logs={filteredLogs}
          title="Stiffness"
          metric="stiffness"
          color="#8B5CF6"
        />
      </div>

      <WellnessInsights insights={insights} />

      {filteredLogs.length === 0 && (
        <Card className="text-center p-8">
          <p className="text-gray-600">No wellness logs found for this period.</p>
        </Card>
      )}
    </div>
  );
};

export default HistoryView;