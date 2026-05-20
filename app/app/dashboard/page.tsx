'use client';

import { AppLayout } from '@/components/app-layout';
import { AppHeader } from '@/components/app-header';
import { StatCard } from '@/components/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dummyLoans, dummyCustomers } from '@/lib/dummy-data';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Users,
  Banknote,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

const chartData = [
  { month: 'Jan', loans: 12, paid: 8 },
  { month: 'Feb', loans: 15, paid: 11 },
  { month: 'Mar', loans: 18, paid: 14 },
  { month: 'Apr', loans: 22, paid: 18 },
  { month: 'May', loans: 25, paid: 21 },
  { month: 'Jun', loans: 28, paid: 24 },
];

const statusData = [
  { name: 'Active', value: 18, fill: '#42a5f5' },
  { name: 'Paid', value: 24, fill: '#66bb6a' },
  { name: 'Overdue', value: 6, fill: '#ef5350' },
];

export default function Dashboard() {
  const totalLoanAmount = dummyLoans.reduce((sum, l) => sum + l.totalAmount, 0);
  const paidAmount = dummyLoans.reduce((sum, l) => sum + l.paidAmount, 0);
  const overdueAmount = dummyLoans
    .filter((l) => l.status === 'overdue')
    .reduce((sum, l) => sum + l.remainingAmount, 0);
  const activeLoans = dummyLoans.filter((l) => l.status === 'active' || l.status === 'overdue')
    .length;
  const collectionRate = ((paidAmount / totalLoanAmount) * 100).toFixed(1);

  return (
    <AppLayout>
      <AppHeader />
      <main className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s your loan portfolio overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Customers"
            value={dummyCustomers.length}
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="Active Loans"
            value={activeLoans}
            icon={<Banknote className="h-5 w-5" />}
          />
          <StatCard
            title="Total Loan Amount"
            value={`${CURRENCY_SYMBOL}${(totalLoanAmount / 1000).toFixed(0)}K`}
            icon={<TrendingUp className="h-5 w-5" />}
            trend={{ value: 12, direction: 'up' }}
          />
          <StatCard
            title="Overdue Amount"
            value={`${CURRENCY_SYMBOL}${(overdueAmount / 1000).toFixed(0)}K`}
            icon={<AlertCircle className="h-5 w-5" />}
            className="md:col-span-2 lg:col-span-1"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Loan Trends */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Loan Activity Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="loans"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    name="New Loans"
                  />
                  <Line
                    type="monotone"
                    dataKey="paid"
                    stroke="var(--status-success)"
                    strokeWidth={2}
                    name="Paid Loans"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Loan Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      />
                      {item.name}
                    </span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Collection Rate</p>
                <p className="text-2xl font-bold text-primary">{collectionRate}%</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold">{CURRENCY_SYMBOL}{(paidAmount / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Pending Amount</p>
                <p className="text-2xl font-bold text-status-warning">
                  {CURRENCY_SYMBOL}
                  {((totalLoanAmount - paidAmount) / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Avg Loan Size</p>
                <p className="text-2xl font-bold">
                  {CURRENCY_SYMBOL}
                  {(totalLoanAmount / dummyLoans.length / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
}
