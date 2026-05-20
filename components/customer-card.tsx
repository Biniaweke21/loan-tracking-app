import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Customer } from '@/lib/types';
import { AvatarInitials } from './avatar-initials';
import { Phone, Mail } from 'lucide-react';

interface CustomerCardProps {
  customer: Customer;
  onClick?: () => void;
}

export function CustomerCard({ customer, onClick }: CustomerCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <AvatarInitials name={customer.name} className="h-10 w-10 text-sm" />
            <div className="flex-1">
              <CardTitle className="text-base">{customer.name}</CardTitle>
              {customer.businessName && (
                <p className="text-sm text-muted-foreground">{customer.businessName}</p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {customer.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{customer.phone}</span>
            </div>
          )}
          {customer.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{customer.email}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 py-2 border-t border-b">
          <div>
            <p className="text-xs text-muted-foreground">Total Loans</p>
            <p className="text-lg font-bold">{customer.totalLoans}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="text-lg font-bold text-primary">{customer.activeLoans}</p>
          </div>
        </div>

        {customer.lastLoan && (
          <div>
            <p className="text-xs text-muted-foreground">Last Loan</p>
            <p className="text-sm">{customer.lastLoan.toLocaleDateString()}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
