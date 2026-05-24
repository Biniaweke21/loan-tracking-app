import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  const styles: Record<string, string> = {
    active: 'bg-[#FFF3E0] text-[#E85D04] border-[#E85D04]/30',
    paid: 'bg-green-50 text-[#16A34A] border-green-200',
    overdue: 'bg-red-50 text-[#DC2626] border-red-200',
    pending: 'bg-gray-50 text-gray-600 border-gray-200',
  };

  const display = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Badge
      variant="outline"
      className={cn(styles[status] || styles.pending, className)}
    >
      {display}
    </Badge>
  );
}
