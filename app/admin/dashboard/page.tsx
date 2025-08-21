'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';

import { useAnalytics } from '@/hooks/useAnalytics';
import Container from '@/components/shared/container/container';
import AdminHeader from '@/components/shared/partials/admin-header';
import MetricCard from '@/components/shared/metric-card';
import ICON_CONFIG from '@/configs/icons';
import { formatTime } from '@/utils/date';

export default function DashboardPage() {
  const {
    dashboardData,
    period,
    metric,
    setPeriod,
    setMetric,
    isLoading,
    hasError,
    refetchAll
  } = useAnalytics();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded-lg" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-300 rounded-lg" />
              <div className="h-96 bg-gray-300 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Analytics
            </h2>
            <p className="text-red-600 mb-4">
              Unable to load analytics data. Please try again.
            </p>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              onClick={refetchAll}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Container
      shadow
      className="border border-gray-200 rounded-2xl"
      orientation="vertical"
    >
      <AdminHeader
        breadcrumbs={['Admin', 'Dashboard']}
        title="Analytics Dashboard"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard
          changePercentage={dashboardData?.analytics.currentPeriod.views.changePercentage}
          changeType={dashboardData?.analytics.currentPeriod.views.changeType}
          icon={ICON_CONFIG.VIEW}
          title={"Views"}
          value={dashboardData?.analytics.currentPeriod.views.value ?? 0}
        />

        <MetricCard
          changePercentage={dashboardData?.analytics.currentPeriod.clicks.changePercentage}
          changeType={dashboardData?.analytics.currentPeriod.clicks.changeType}
          icon={ICON_CONFIG.MOUSE_CLICK}
          title={"Clicks"}
          value={dashboardData?.analytics.currentPeriod.clicks.value ?? 0}
        />
        <MetricCard
          changePercentage={dashboardData?.analytics.currentPeriod.engagementTime.changePercentage}
          changeType={dashboardData?.analytics.currentPeriod.engagementTime.changeType}
          icon={ICON_CONFIG.TIMER}
          title={"Engagement Time"}
          value={formatTime(dashboardData?.analytics.currentPeriod.engagementTime.value ?? 0)}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <Table>
          <TableHeader>
            <TableColumn>Top Pages</TableColumn>
            <TableColumn align={"center"}>View</TableColumn>
            <TableColumn align={"center"}>Click</TableColumn>
          </TableHeader>
          <TableBody items={dashboardData?.topPages ?? []}>
            {(page) => (
              <TableRow key={page.page}>
                <TableCell>{page.page}</TableCell>
                <TableCell>{page.views}</TableCell>
                <TableCell>{page.clicks}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

    </Container>

  );
}