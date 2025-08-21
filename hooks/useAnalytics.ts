import { useState, useEffect, useCallback } from 'react';

import { useFetch } from './useFetch';

import { IAPIResponse } from '@/types/global';
import API_ROUTE from '@/configs/api';
import { TAnalyticsDashboard, TAnalyticsResponse } from '@/types/analytics';

export const useAnalytics = () => {
  const [period, setPeriod] = useState<'7days' | '30days' | '12months' | '24hours'>('30days');
  const [metric, setMetric] = useState<'views' | 'clicks'>('views');

  // Fetch dashboard data
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    fetch: refetchDashboard
  } = useFetch<IAPIResponse<TAnalyticsDashboard>>(
    API_ROUTE.ANALYTICS.GET_DASHBOARD,
    { period },
    { method: 'GET' }
  );

  const refetchAll = useCallback(() => {
    refetchDashboard();
  }, [refetchDashboard]);

  // Refetch when period changes
  useEffect(() => {
    refetchAll();
  }, [period]);

  const isLoading = dashboardLoading;
  const hasError = dashboardError;

  return {
    // Data
    dashboardData: dashboardData?.results,

    // State
    period,
    metric,

    // Actions
    setPeriod,
    setMetric,
    refetchAll,

    // Loading states
    isLoading,
    dashboardLoading,

    // Errors
    hasError,
    dashboardError,
  };
};
