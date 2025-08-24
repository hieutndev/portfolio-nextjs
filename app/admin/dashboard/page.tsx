'use client';

import React from 'react';
import { Card, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';

import { useAnalytics } from '@/hooks/useAnalytics';
import MetricCard from '@/components/shared/metric-card';
import { formatTime } from '@/utils/date';
import { listMetrics, listPeriods, TPeriod } from '@/types/analytics';
import Container from '@/components/shared/container/container';

export default function DashboardPage() {
  const {
    dashboardData,
    topViewedArticles,
    hasError,
    refetchAll,
    period,
    setPeriod
  } = useAnalytics();

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
    <div
      className="flex flex-col gap-4"
    >
      <Card className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"}>
        <div className={"col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-between"}>
          <h3 className={"text-xl font-semibold"}>Google Analytics Overview</h3>
          <Select
            className="max-w-xs"
            items={listPeriods}
            label={""}
            placeholder={"Select a period"}
            selectedKeys={[period]}
            variant={"bordered"}
            onChange={(value) => setPeriod(value.target.value as TPeriod)}
          >
            {(period) => <SelectItem key={period.value}>{period.label}</SelectItem>}
          </Select>
        </div>
        {listMetrics.map((metric) => {
          const value = dashboardData?.analytics.currentPeriod[metric.fieldName].value ?? 0;
          const previousValue = dashboardData?.analytics.currentPeriod[metric.fieldName].previousValue ?? 0;

          const diffValueRaw = metric.isTime ? value - previousValue : previousValue - value;
          const diffValue = metric.isTime ? formatTime(diffValueRaw, "fullTime") : diffValueRaw;

          return (
            <MetricCard
              key={metric.fieldName}
              changePercentage={dashboardData?.analytics.currentPeriod[metric.fieldName].changePercentage}
              changeType={dashboardData?.analytics.currentPeriod[metric.fieldName].changeType}
              description={listPeriods.find((p) => p.value === period)?.description ?? ''}
              diffValue={diffValue}
              icon={metric.icon}
              title={metric.title}
              value={
                metric.isTime
                  ? formatTime(value, "fullTime")
                  : value
              }
            />
          );
        })}
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className={"flex flex-col gap-4 p-4 h-full"}>
          <h3 className="text-lg font-semibold ">
            Google Analytics Page Metrics
          </h3>
          <Table removeWrapper>
            <TableHeader>
              <TableColumn>Top Pages</TableColumn>
              <TableColumn align={"start"}>Engagement Time</TableColumn>
              <TableColumn align={"center"}>View</TableColumn>
              <TableColumn align={"center"}>Click</TableColumn>
            </TableHeader>
            <TableBody items={dashboardData?.topPages ?? []}>
              {(page) => (
                <TableRow key={page.page}>
                  <TableCell>{page.page}</TableCell>
                  <TableCell>{formatTime(page.engagementTime, "fullTime")}</TableCell>
                  <TableCell>{page.views}</TableCell>
                  <TableCell>{page.clicks}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        <Card
          className={"flex flex-col gap-4 p-4 h-full"}
        >
          <h3 className="text-lg font-semibold">
            Top View Articles
          </h3>
          <Table removeWrapper>
            <TableHeader>
              <TableColumn>Article Title</TableColumn>
              <TableColumn align={"center"}>View Count</TableColumn>
            </TableHeader>
            <TableBody items={topViewedArticles ?? []}>
              {(article) => (
                <TableRow key={article.title}>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>{article.views}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

        </Card>
      </div>

    </div>

  );
}