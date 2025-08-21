import React from 'react';

import { TReviewInsight } from '@/types/analytics';

interface TReviewInsightsProps {
  data: TReviewInsight[];
  selectedPeriod: '7days' | '30days' | '12months' | '24hours';
  onPeriodChange: (period: '7days' | '30days' | '12months' | '24hours') => void;
}

const ReviewInsights: React.FC<TReviewInsightsProps> = ({
  data,
  selectedPeriod,
  onPeriodChange
}) => {
  const periods = [
    { key: '12months' as const, label: '12 months' },
    { key: '30days' as const, label: '30 days' },
    { key: '7days' as const, label: '7 days' },
    { key: '24hours' as const, label: '24 hours' }
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);

    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Review Insights</h3>
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
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No reviews found for the selected period.</p>
          </div>
        ) : (
          data.map((review, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {review.rating}/5
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(review.date)}
                </span>
              </div>
              
              {review.reviewerName && (
                <p className="text-sm font-medium text-gray-700 mb-2">
                  By {review.reviewerName}
                </p>
              )}
              
              <p className="text-sm text-gray-600 leading-relaxed">
                {review.review}
              </p>
            </div>
          ))
        )}
      </div>
      
      {data.length > 5 && (
        <div className="text-center mt-4">
          <span className="text-sm text-gray-500">
            Showing {data.length} recent reviews
          </span>
        </div>
      )}
    </div>
  );
};

export default ReviewInsights;
