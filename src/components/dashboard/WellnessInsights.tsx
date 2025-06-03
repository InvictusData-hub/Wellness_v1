import React from 'react';
import { InsightData } from '../../types';
import Card from '../ui/Card';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';

interface WellnessInsightsProps {
  insights: InsightData[];
}

const WellnessInsights: React.FC<WellnessInsightsProps> = ({ insights }) => {
  const getTrendIcon = (trend: InsightData['trend']) => {
    switch (trend) {
      case 'improving':
        return (
          <div className="p-2 bg-green-100 rounded-full">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
        );
      case 'declining':
        return (
          <div className="p-2 bg-red-100 rounded-full">
            <TrendingDown className="h-5 w-5 text-red-600" />
          </div>
        );
      case 'stable':
      default:
        return (
          <div className="p-2 bg-blue-100 rounded-full">
            <Minus className="h-5 w-5 text-blue-600" />
          </div>
        );
    }
  };
  
  const getTrendArrow = (trend: InsightData['trend']) => {
    switch (trend) {
      case 'improving':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'declining':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      case 'stable':
      default:
        return <ArrowRight className="h-4 w-4 text-blue-600" />;
    }
  };
  
  return (
    <Card title="Wellness Insights" className="h-full">
      {insights.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          No insights available yet. Start logging your wellness data to receive personalized insights.
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {insights.map((insight, index) => (
            <div key={index} className={`py-3 ${index === 0 ? 'pt-0' : ''}`}>
              <div className="flex items-center">
                {getTrendIcon(insight.trend)}
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{insight.metric}</h4>
                    <div className="flex items-center text-xs font-medium">
                      <span className={`
                        ${insight.trend === 'improving' ? 'text-green-600' : ''}
                        ${insight.trend === 'declining' ? 'text-red-600' : ''}
                        ${insight.trend === 'stable' ? 'text-blue-600' : ''}
                      `}>
                        {insight.trend.charAt(0).toUpperCase() + insight.trend.slice(1)}
                      </span>
                      <span className="ml-1">{getTrendArrow(insight.trend)}</span>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{insight.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default WellnessInsights;