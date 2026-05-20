'use client';

import { AppLayout } from '@/components/app-layout';
import { AppHeader } from '@/components/app-header';
import { CustomerCard } from '@/components/customer-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dummyCustomers } from '@/lib/dummy-data';
import { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';

export default function CustomersPage() {
  const [search, setSearch] = useState('');

  const filteredCustomers = useMemo(() => {
    return dummyCustomers.filter((customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email?.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.includes(search)
    );
  }, [search]);

  return (
    <AppLayout>
      <AppHeader />
      <main className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Customers</h1>
            <p className="text-muted-foreground mt-1">
              Manage your customer database
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Customers Grid */}
        {filteredCustomers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCustomers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No customers found</p>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
