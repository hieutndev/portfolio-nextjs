import React from 'react';

import { TTrafficData } from '@/types/analytics';

interface TTrafficTrendsProps {
  data: TTrafficData[];
  selectedPeriod: '7days' | '30days' | '12months' | '24hours';
  onPeriodChange: (period: '7days' | '30days' | '12months' | '24hours') => void;
  selectedMetric: 'views' | 'clicks';
  onMetricChange: (metric: 'views' | 'clicks') => void;
}

const TrafficTrends: React.FC<TTrafficTrendsProps> = ({
  data,
  selectedPeriod,
  onPeriodChange,
  selectedMetric,
  onMetricChange
}) => {
  const periods = [
    { key: '12months' as const, label: '12 months' },
    { key: '30days' as const, label: '30 days' },
    { key: '7days' as const, label: '7 days' },
    { key: '24hours' as const, label: '24 hours' }
  ];

  const metrics = [
    { key: 'views' as const, label: 'Views' },
    { key: 'clicks' as const, label: 'Clicks' }
  ];

  const maxValue = Math.max(...data.map(d => Math.max(d.views, d.clicks)));
  const getBarHeight = (value: number) => (value / maxValue) * 100;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);

    if (selectedPeriod === '12months') {
      return date.toLocaleDateString('en-US', { month: 'short' });
    }
    if (selectedPeriod === '30days' || selectedPeriod === '7days') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    return date.toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Traffic Trends</h3>
        <div className="flex items-center space-x-4">
          {/* Period Selector */}
          <div className="flex rounded-md border">
            {periods.map((period) => (
              <button
                key={period.key}
                className={`px-3 py-1 text-sm font-medium transition-colors ${
                  selectedPeriod === period.key
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } ${period.key === '12months' ? 'rounded-l-md' : ''} ${
                  period.key === '24hours' ? 'rounded-r-md' : ''
                }`}
                onClick={() => onPeriodChange(period.key)}
              >
                {period.label}
              </button>
            ))}
          </div>
          
          {/* Metric Selector */}
          <div className="flex rounded-md border">
            {metrics.map((metric) => (
              <button
                key={metric.key}
                className={`px-3 py-1 text-sm font-medium transition-colors ${
                  selectedMetric === metric.key
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } ${metric.key === 'views' ? 'rounded-l-md' : 'rounded-r-md'}`}
                onClick={() => onMetricChange(metric.key)}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <div className="flex items-end justify-between h-64 border-b border-gray-200">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1 px-1">
              <div className="relative w-full max-w-12 h-full flex items-end">
                <div
                  className={`w-full rounded-t transition-all duration-300 ${
                    selectedMetric === 'views' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}
                  style={{
                    height: `${getBarHeight(item[selectedMetric])}%`,
                    minHeight: item[selectedMetric] > 0 ? '2px' : '0px'
                  }}
                  title={`${formatDate(item.date)}: ${item[selectedMetric]} ${selectedMetric}`}
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2">
          {data.map((item, index) => {
            // Show every nth label to avoid crowding
            const showLabel = selectedPeriod === '12months' 
              ? index % 2 === 0 
              : selectedPeriod === '30days'
              ? index % 5 === 0
              : selectedPeriod === '7days'
              ? true
              : index % 3 === 0;
              
            return (
              <div key={index} className="flex-1 text-center">
                {showLabel && (
                  <span className="text-xs text-gray-500">
                    {formatDate(item.date)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center mt-4 space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded" />
          <span className="text-sm text-gray-600">Views</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span className="text-sm text-gray-600">Clicks</span>
        </div>
      </div>
    </div>
  );
};

export default TrafficTrends;
