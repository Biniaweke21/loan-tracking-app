'use client';

import { AppLayout } from '@/components/app-layout';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bell, Lock, User, Zap } from 'lucide-react';

export default function SettingsPage() {
  return (
    <AppLayout>
      <AppHeader />
      <main className="p-4 md:p-6 space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>Update your business information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="business-name">Business Name</Label>
                <Input id="business-name" placeholder="Your business" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="owner-name">Owner Name</Label>
                <Input id="owner-name" placeholder="Your name" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+251911223344" className="mt-1.5" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" className="mt-1.5" />
            </div>
            <Button variant="outline">Change Password</Button>

            <Separator />

            <div>
              <h4 className="font-semibold mb-4">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline">Enable 2FA</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Choose how you want to be notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {[
                {
                  label: 'Loan Reminders',
                  desc: 'Get notified about upcoming loan due dates',
                },
                {
                  label: 'Payment Confirmations',
                  desc: 'Receive notifications when payments are made',
                },
                {
                  label: 'Overdue Alerts',
                  desc: 'Get alerts for overdue loans',
                },
                {
                  label: 'Weekly Reports',
                  desc: 'Receive weekly portfolio summary reports',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={idx < 3} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Integration Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Integrations
            </CardTitle>
            <CardDescription>Connect third-party services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">SMS Gateway</p>
                <p className="text-sm text-muted-foreground">Send SMS reminders</p>
              </div>
              <Button variant="outline" size="sm">
                Connect
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">WhatsApp Business</p>
                <p className="text-sm text-muted-foreground">Send WhatsApp notifications</p>
              </div>
              <Button variant="outline" size="sm">
                Connect
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Email Service</p>
                <p className="text-sm text-muted-foreground">Configure email notifications</p>
              </div>
              <Button variant="outline" size="sm">
                Connect
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
}
