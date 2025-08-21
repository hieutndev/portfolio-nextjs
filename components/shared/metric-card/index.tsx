import { Card, CardBody, CardHeader } from '@heroui/react';
import React from 'react';

interface TMetricCardProps {
  title: string;
  value: number | string;
  previousValue?: number;
  changePercentage?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  suffix?: string;
  className?: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }

  return num.toString();
};

export default function MetricCard({
  title,
  value,
  previousValue,
  changePercentage,
  changeType,
  icon,
  suffix,
  className
}: TMetricCardProps) {
  const getChangeColor = () => {
    if (!changeType || changeType === 'neutral') return 'text-primary';

    return changeType === 'increase' ? 'text-green-500' : 'text-red-500';
  };

  const getChangeBgColor = () => {
    if (!changeType || changeType === 'neutral') return 'bg-gray-100';

    return changeType === 'increase' ? 'bg-green-100' : 'bg-red-100';
  };

  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val;

    return formatNumber(val) + (suffix ?? '');
  };

  return (
    <Card className={className}>
      <CardBody className="p-4 gap-4">
        <div className={"flex items-center gap-2"}>
          {icon && <div className="text-default-400 text-xl">{icon}</div>}
          <small className="text-sm text-default-500 font-medium">{title}</small>
        </div>
        <p className={`${getChangeColor()} text-4xl font-bold`}>{formatValue(value)}</p>
        {changePercentage !== undefined && (
          <div className="flex items-center mt-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getChangeBgColor()} ${getChangeColor()}`}>
              {changeType === 'increase' ? '+' : changeType === 'decrease' ? '-' : ''}
              {Math.abs(changePercentage).toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500 ml-2">
              more vs last month
            </span>
          </div>
        )}
      </CardBody>
    </Card>


  );
};
