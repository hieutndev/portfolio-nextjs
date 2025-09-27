import { useState, useEffect, useCallback } from 'react';
import { useFetch } from 'hieutndev-toolkit';

import { IAPIResponse } from '@/types/global';
import API_ROUTE from '@/configs/api';
import { TAnalyticsDashboard, TTopViewedArticle } from '@/types/analytics';

export const useAnalytics = () => {
  const [period, setPeriod] = useState<'7days' | '30days' | '12months' | '24hours'>('24hours');

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

  // Fetch top viewed articles
  const {
    data: topViewedArticlesData,
    loading: topViewedArticlesLoading,
    error: topViewedArticlesError,
    fetch: refetchTopViewedArticles
  } = useFetch<IAPIResponse<TTopViewedArticle[]>>(
    API_ROUTE.PROJECT.GET_TOP_VIEWED,
    { method: 'GET' }
  );

  const refreshDashboardData = useCallback(() => {
    refetchDashboard();
  }, [refetchDashboard]);

  const refreshTopViewedArticles = useCallback(() => {
    refetchTopViewedArticles();
  }, [refetchTopViewedArticles]);

  const refetchAll = useCallback(() => {
    refreshDashboardData();
    refreshTopViewedArticles();
  }, [refreshDashboardData, refreshTopViewedArticles]);

  // Refetch when period changes
  useEffect(() => {
    refreshDashboardData();
  }, [period]);

  const isLoading = dashboardLoading || topViewedArticlesLoading;
  const hasError = dashboardError || topViewedArticlesError;

  return {
    dashboardData: dashboardData?.results,
    topViewedArticles: topViewedArticlesData?.results || [],
    period,
    setPeriod,
    hasError,
    refetchAll,
    isLoading,
  };
};
