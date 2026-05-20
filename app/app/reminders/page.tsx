'use client';

import { AppLayout } from '@/components/app-layout';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dummyReminders, dummyLoans, dummyCustomers } from '@/lib/dummy-data';
import { MessageSquare, Phone, Mail, MessageCircle, Send } from 'lucide-react';

export default function RemindersPage() {
  const getPendingReminders = () => dummyReminders.filter((r) => r.status === 'pending');
  const getSentReminders = () => dummyReminders.filter((r) => r.status === 'sent');
  const getFailedReminders = () => dummyReminders.filter((r) => r.status === 'failed');

  const getReminderIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      sms: <MessageSquare className="h-4 w-4" />,
      call: <Phone className="h-4 w-4" />,
      email: <Mail className="h-4 w-4" />,
      whatsapp: <MessageCircle className="h-4 w-4" />,
    };
    return icons[type] || <MessageSquare className="h-4 w-4" />;
  };

  const getLoanCustomer = (loanId: string) => {
    const loan = dummyLoans.find((l) => l.id === loanId);
    if (!loan) return null;
    return dummyCustomers.find((c) => c.id === loan.customerId);
  };

  const ReminderList = ({ reminders }: { reminders: typeof dummyReminders }) => {
    return (
      <div className="space-y-3">
        {reminders.length > 0 ? (
          reminders.map((reminder) => {
            const customer = getLoanCustomer(reminder.loanId);
            return (
              <Card key={reminder.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="mt-1">{getReminderIcon(reminder.type)}</div>
                      <div className="flex-1">
                        <div className="font-semibold">{customer?.name || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">
                          Loan {reminder.loanId}
                        </div>
                        {reminder.message && (
                          <div className="text-sm mt-2 p-2 bg-muted rounded">
                            {reminder.message}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-2">
                          {reminder.scheduledDate.toLocaleDateString()} at{' '}
                          {reminder.scheduledDate.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge variant="outline" className="capitalize">
                        {reminder.type}
                      </Badge>
                      {reminder.status === 'pending' && (
                        <Button size="sm" variant="outline">
                          <Send className="mr-1 h-3 w-3" />
                          Send
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No reminders in this category
          </div>
        )}
      </div>
    );
  };

  return (
    <AppLayout>
      <AppHeader />
      <main className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reminders</h1>
          <p className="text-muted-foreground mt-1">
            Manage payment reminders and customer notifications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {getPendingReminders().length}
                </div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-status-success">
                  {getSentReminders().length}
                </div>
                <div className="text-xs text-muted-foreground">Sent</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">
                  {getFailedReminders().length}
                </div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending ({getPendingReminders().length})
            </TabsTrigger>
            <TabsTrigger value="sent">
              Sent ({getSentReminders().length})
            </TabsTrigger>
            <TabsTrigger value="failed">
              Failed ({getFailedReminders().length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <ReminderList reminders={getPendingReminders()} />
          </TabsContent>

          <TabsContent value="sent" className="mt-6">
            <ReminderList reminders={getSentReminders()} />
          </TabsContent>

          <TabsContent value="failed" className="mt-6">
            <ReminderList reminders={getFailedReminders()} />
          </TabsContent>
        </Tabs>
      </main>
    </AppLayout>
  );
}
