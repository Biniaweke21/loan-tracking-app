import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CURRENCY_SYMBOL, ROUTES } from '@/lib/constants';
import { Loan } from '@/lib/types';
import { AvatarInitials } from './avatar-initials';

interface LoanCardProps {
  loan: Loan;
  customerName: string;
  onClick?: () => void;
}

export function LoanCard({ loan, customerName, onClick }: LoanCardProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
      active: 'default',
      paid: 'secondary',
      overdue: 'destructive',
      pending: 'outline',
    };
    return variants[status] || 'default';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'text-blue-600 bg-blue-50',
      paid: 'text-green-600 bg-green-50',
      overdue: 'text-red-600 bg-red-50',
      pending: 'text-gray-600 bg-gray-50',
    };
    return colors[status] || '';
  };

  const percentagePaid = (loan.paidAmount / loan.totalAmount) * 100;

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <AvatarInitials name={customerName} className="h-10 w-10 text-sm" />
            <div className="flex-1">
              <CardTitle className="text-base">{customerName}</CardTitle>
              <p className="text-sm text-muted-foreground">Loan ID: {loan.id}</p>
            </div>
          </div>
          <Badge variant={getStatusBadge(loan.status)}>{loan.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Amount</span>
          <span className="font-semibold">
            {CURRENCY_SYMBOL} {loan.totalAmount.toLocaleString()}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Paid</span>
            <span>{CURRENCY_SYMBOL} {loan.paidAmount.toLocaleString()}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${Math.min(percentagePaid, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Due Date</p>
            <p className="text-sm font-medium">{loan.dueDate.toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Interest</p>
            <p className="text-sm font-medium">{loan.interestRate}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
