// Kirari Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  businessName?: string;
  totalLoans: number;
  activeLoans: number;
  createdAt: Date;
  lastLoan?: Date;
}

export interface Loan {
  id: string;
  customerId: string;
  amount: number;
  currency: string;
  disburseDate: Date;
  dueDate: Date;
  status: 'active' | 'paid' | 'overdue' | 'pending';
  interestRate: number;
  totalInterest: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentFrequency: string;
  notes?: string;
  voiceNote?: string;
  createdAt: Date;
}

export interface Payment {
  id: string;
  loanId: string;
  amount: number;
  date: Date;
  method: string;
  notes?: string;
  createdAt: Date;
}

export interface Reminder {
  id: string;
  loanId: string;
  type: 'sms' | 'call' | 'email' | 'whatsapp';
  scheduledDate: Date;
  sentDate?: Date;
  status: 'pending' | 'sent' | 'failed';
  message?: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalCustomers: number;
  activeLoans: number;
  totalLoanAmount: number;
  totalPaidAmount: number;
  overdueLoanAmount: number;
  dueThisMonth: number;
  collectionRate: number;
}

export interface LoansFilterParams {
  status?: string;
  customerId?: string;
  search?: string;
}
