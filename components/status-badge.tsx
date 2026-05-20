import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'active' | 'paid' | 'overdue' | 'pending';
  label?: string;
  className?: string;
}

export function StatusBadge({
  status,
  label,
  className = '',
}: StatusBadgeProps) {
  const variants: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
    active: 'default',
    paid: 'secondary',
    overdue: 'destructive',
    pending: 'outline',
  };

  const display = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Badge variant={variants[status] || 'default'} className={className}>
      {display}
    </Badge>
  );
}
