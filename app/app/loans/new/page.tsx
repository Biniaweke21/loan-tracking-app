'use client';

import { AppLayout } from '@/components/app-layout';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { dummyCustomers } from '@/lib/dummy-data';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { useState } from 'react';
import { ArrowLeft, Mic } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default function NewLoanPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customer: '',
    amount: '',
    interestRate: '',
    dueDate: '',
    paymentFrequency: 'monthly',
    notes: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log('Loan created:', formData);
    // Handle loan creation
  };

  return (
    <AppLayout>
      <AppHeader />
      <main className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Link href={ROUTES.LOANS}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Create New Loan</h1>
            <p className="text-muted-foreground mt-1">Step {step} of 4</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <Card>
          <CardContent className="pt-6">
            {/* Step 1: Customer Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Select Customer</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Who is this loan for?
                  </p>
                  <Select value={formData.customer} onValueChange={(value) => handleInputChange('customer', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a customer..." />
                    </SelectTrigger>
                    <SelectContent>
                      {dummyCustomers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} ({customer.businessName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Can&apos;t find the customer? Create a new customer first from the Customers page.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Loan Amount & Interest */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Loan Details</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enter the loan amount and terms
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Loan Amount ({CURRENCY_SYMBOL})</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="50000"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="interest">Interest Rate (%)</Label>
                    <Input
                      id="interest"
                      type="number"
                      step="0.1"
                      placeholder="10"
                      value={formData.interestRate}
                      onChange={(e) => handleInputChange('interestRate', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="frequency">Payment Frequency</Label>
                    <Select value={formData.paymentFrequency} onValueChange={(value) => handleInputChange('paymentFrequency', value)}>
                      <SelectTrigger id="frequency" className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Due Date */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Due Date</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    When should this loan be repaid?
                  </p>
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="text-sm">
                    {formData.amount && formData.interestRate
                      ? `Total to repay: ${CURRENCY_SYMBOL}${(parseFloat(formData.amount) + parseFloat(formData.amount) * parseFloat(formData.interestRate) / 100).toLocaleString()}`
                      : 'Fill in the loan amount and interest to see total'}
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Notes & Voice */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Additional Information</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add any notes or record a voice memo
                  </p>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional details about this loan..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="mt-1.5 min-h-24"
                  />
                </div>

                <div>
                  <Button variant="outline" className="w-full">
                    <Mic className="mr-2 h-4 w-4" />
                    Record Voice Note
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
          >
            Previous
          </Button>
          {step < 4 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Create Loan</Button>
          )}
        </div>
      </main>
    </AppLayout>
  );
}
