import ICON_CONFIG from "@/configs/icons";

export interface TAnalyticsMetric {
  value: number;
  previousValue?: number;
  changePercentage?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
}

export interface TAnalyticsPeriod {
  views: TAnalyticsMetric;
  clicks: TAnalyticsMetric;
  engagementTime: TAnalyticsMetric;
  totalVisitors: TAnalyticsMetric;
  newVisitors: TAnalyticsMetric;
  totalSessions: TAnalyticsMetric;
}

export type TPeriod = '7days' | '30days' | '12months' | '24hours';

export interface TAnalyticsResponse {
  currentPeriod: TAnalyticsPeriod;
  period: TPeriod;
}
export interface TAnalyticsDashboard {
  analytics: TAnalyticsResponse;
  topPages?: {
    page: string;
    views: number;
    clicks: number;
    engagementTime: number;
  }[];
}

export interface TTopViewedArticle {
  title: string;
  views: number;
}

type TListMetric = {
  fieldName: keyof TAnalyticsPeriod;
  icon: React.ReactNode;
  title: string;
  isTime: boolean;
}

export const listMetrics: TListMetric[] = [
  {
    fieldName: "views",
    icon: ICON_CONFIG.VIEW,
    title: "Views",
    isTime: false
  },
  {
    fieldName: "clicks",
    icon: ICON_CONFIG.MOUSE_CLICK,
    title: "Clicks",
    isTime: false
  },
  {
    fieldName: "engagementTime",
    icon: ICON_CONFIG.TIMER,
    title: "Engagement Time",
    isTime: true
  },
  {
    fieldName: "totalVisitors",
    icon: ICON_CONFIG.VISITORS,
    title: "Total Visitors",
    isTime: false
  },
  {
    fieldName: "newVisitors",
    icon: ICON_CONFIG.NEW_VISITORS,
    title: "New Visitors",
    isTime: false
  },
  {
    fieldName: "totalSessions",
    icon: ICON_CONFIG.USER_SESSIONS,
    title: "Total Sessions",
    isTime: false
  }
];

export const listPeriods = [
  { value: '7days', label: 'Last 7 Days', description: 'from last 7 days' },
  { value: '30days', label: 'Last 30 Days', description: 'from last 30 days' },
  { value: '12months', label: 'Last 12 Months', description: 'from last 12 months' },
  { value: '24hours', label: 'Last 24 Hours', description: 'from last 24 hours' },
];

