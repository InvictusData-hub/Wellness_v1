import React, { useEffect, useRef } from 'react';
import { WellnessLog } from '../../types';
import Card from '../ui/Card';
import { format } from 'date-fns';

interface WellnessChartProps {
  logs: WellnessLog[];
  title: string;
  metric: keyof WellnessLog;
  color: string;
}

const WellnessChart: React.FC<WellnessChartProps> = ({ 
  logs, 
  title, 
  metric, 
  color 
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!chartRef.current || logs.length === 0) return;
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear previous rendering
    ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);
    
    // Sort logs by date (oldest first)
    const sortedLogs = [...logs].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Extract last 7 logs at most
    const recentLogs = sortedLogs.slice(-7);
    
    // Extract dates and metric values
    const dates = recentLogs.map(log => format(new Date(log.date), 'MMM d'));
    const values = recentLogs.map(log => Number(log[metric]));
    
    // Chart dimensions
    const width = chartRef.current.width;
    const height = chartRef.current.height;
    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;
    
    // Draw axis
    ctx.beginPath();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // y-axis
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    
    // x-axis
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw horizontal grid lines
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#6b7280';
    
    for (let i = 0; i <= 10; i += 2) {
      const y = height - padding - (i / 10) * graphHeight;
      
      ctx.beginPath();
      ctx.strokeStyle = '#e5e7eb';
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      ctx.fillText(i.toString(), padding - 5, y);
    }
    
    // Plot data points
    const barWidth = graphWidth / dates.length / 2;
    
    // Draw bars
    ctx.fillStyle = color;
    
    values.forEach((value, index) => {
      const x = padding + (index + 0.5) * (graphWidth / dates.length);
      const barHeight = (value / 10) * graphHeight;
      
      ctx.fillRect(
        x - barWidth / 2,
        height - padding - barHeight,
        barWidth,
        barHeight
      );
    });
    
    // Draw date labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#6b7280';
    
    dates.forEach((date, index) => {
      const x = padding + (index + 0.5) * (graphWidth / dates.length);
      ctx.fillText(date, x, height - padding + 5);
    });
    
    // Draw connecting line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    values.forEach((value, index) => {
      const x = padding + (index + 0.5) * (graphWidth / dates.length);
      const y = height - padding - (value / 10) * graphHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw data points
    values.forEach((value, index) => {
      const x = padding + (index + 0.5) * (graphWidth / dates.length);
      const y = height - padding - (value / 10) * graphHeight;
      
      ctx.beginPath();
      ctx.fillStyle = 'white';
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    
  }, [logs, metric, color]);
  
  return (
    <Card 
      title={title}
      subtitle={`Last ${Math.min(logs.length, 7)} days`}
      className="h-full"
    >
      {logs.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          No data available yet. Start logging your wellness to see charts.
        </div>
      ) : (
        <div className="pt-2">
          <canvas 
            ref={chartRef} 
            width={400} 
            height={250}
            className="w-full h-auto"
          />
        </div>
      )}
    </Card>
  );
};

export default WellnessChart;