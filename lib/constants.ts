// Kirari Constants
export const CURRENCY = 'ETB';
export const CURRENCY_SYMBOL = 'Br';

export const LOAN_STATUS = {
  ACTIVE: 'active',
  PAID: 'paid',
  OVERDUE: 'overdue',
  PENDING: 'pending',
} as const;

export const REMINDER_TYPE = {
  SMS: 'sms',
  CALL: 'call',
  EMAIL: 'email',
  WHATSAPP: 'whatsapp',
} as const;

export const PAYMENT_FREQUENCY = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom',
} as const;

export const LANGUAGES = {
  AMHARIC: 'am',
  ENGLISH: 'en',
  OROMIFA: 'om',
} as const;

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  REGISTER: '/register',
  REGISTER_SHOP: '/register/shop',
  REGISTER_BUYER: '/register/buyer',
  LOGIN: '/login',
  DASHBOARD: '/app/dashboard',
  BUYER_DASHBOARD: '/buyer/dashboard',
  LOANS: '/app/loans',
  NEW_LOAN: '/app/loans/new',
  CUSTOMERS: '/app/customers',
  REMINDERS: '/app/reminders',
  SETTINGS: '/app/settings',
} as const;
