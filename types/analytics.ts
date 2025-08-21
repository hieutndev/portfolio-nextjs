export interface TAnalyticsMetric {
  value: number;
  previousValue?: number;
  changePercentage?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
}

export interface TTrafficData {
  date: string;
  views: number;
  clicks: number;
}

export interface TAnalyticsPeriod {
  views: TAnalyticsMetric;
  clicks: TAnalyticsMetric;
  engagementTime: TAnalyticsMetric;
}

export interface TAnalyticsResponse {
  trafficTrends: TTrafficData[];
  currentPeriod: TAnalyticsPeriod;
  period: '7days' | '30days' | '12months' | '24hours';
}

export interface TReviewInsight {
  date: string;
  rating: number;
  review: string;
  reviewerName?: string;
}

export interface TAnalyticsDashboard {
  analytics: TAnalyticsResponse;
  reviewInsights: TReviewInsight[];
  topPages?: {
    page: string;
    views: number;
    clicks: number;
  }[];
  topQueries?: {
    query: string;
    impressions: number;
    clicks: number;
    ctr: number;
  }[];
}
