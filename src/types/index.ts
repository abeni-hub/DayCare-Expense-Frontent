export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Account {
  id: string;
  type: 'cash' | 'bank';
  name: string;
  balance: number;
}

export interface ExpenseItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface DebitDetails {
  cashAmount: number;
  bankAmount: number;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  supplier: string;
  paymentSource: 'cash' | 'bank' | 'both';
  debitDetails: DebitDetails;
  total: number;
  items: ExpenseItem[];
  invoiceFile?: string;
  remarks: string;
}

export interface Refill {
  id: string;
  date: string;
  accountId: string;
  amount: number;
  method: string;
  notes: string;
}

export interface Income {
  id: string;
  date: string;
  description: string;
  amount: number;
  source: string;
  category: string;
  paymentMethod: 'cash' | 'bank' | 'both';
  debitDetails: DebitDetails;
  receiptFile?: string;
  remarks: string;
}

export interface BankAccount {
  accounts: Account[];
  refills: Refill[];
  expenses: Expense[];
}
