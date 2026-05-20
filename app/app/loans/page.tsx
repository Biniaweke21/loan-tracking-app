'use client';

import Link from 'next/link';
import { AppLayout } from '@/components/app-layout';
import { AppHeader } from '@/components/app-header';
import { LoanCard } from '@/components/loan-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dummyLoans, dummyCustomers } from '@/lib/dummy-data';
import { ROUTES } from '@/lib/constants';
import { useState, useMemo } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LoansPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const getCustomerName = (customerId: string) => {
    return dummyCustomers.find((c) => c.id === customerId)?.name || 'Unknown';
  };

  const filteredLoans = useMemo(() => {
    return dummyLoans.filter((loan) => {
      const customerName = getCustomerName(loan.customerId).toLowerCase();
      const matchesSearch = search === '' || customerName.includes(search.toLowerCase()) || loan.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === null || loan.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <AppLayout>
      <AppHeader />
      <main className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Loans</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all loans
            </p>
          </div>
          <Link href={ROUTES.NEW_LOAN}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Loan
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer or loan ID..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('overdue')}>
                Overdue
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('paid')}>
                Paid
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Loans Grid */}
        {filteredLoans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                customerName={getCustomerName(loan.customerId)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No loans found</p>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
