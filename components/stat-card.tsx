import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  onClick,
  className = '',
}: StatCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer hover:shadow-lg transition-shadow ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-primary">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs mt-2 ${trend.direction === 'up' ? 'text-status-success' : 'text-status-warning'}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
          </p>
        )}
      </CardContent>
    </Card>
  );
}
