import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Account, Expense, Refill, Income } from '../types';
import { generateMockData } from '../utils/mockData';

interface DataContextType {
  accounts: Account[];
  updateAccountBalance: (accountId: string, newBalance: number) => void;
  refills: Refill[];
  addRefill: (refill: Omit<Refill, 'id'>) => void;
  deleteRefill: (id: string) => void;
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Expense) => void;
  deleteExpense: (id: string) => void;
  incomes: Income[];
  addIncome: (income: Omit<Income, 'id'>) => void;
  updateIncome: (id: string, income: Income) => void;
  deleteIncome: (id: string) => void;
  getAccountBalance: (accountId: string) => number;
  getTotalBalance: () => number;
  getTotalExpensesBySource: (source: 'cash' | 'bank' | 'both') => number;
  getTotalExpenses: () => number;
  getTotalRefillsByAccount: (accountId: string) => number;
  getTotalIncome: () => number;
  getTotalIncomeByMethod: (method: 'cash' | 'bank' | 'both') => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [refills, setRefills] = useState<Refill[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const savedAccounts = localStorage.getItem('daycare_accounts');
    const savedRefills = localStorage.getItem('daycare_refills');
    const savedExpenses = localStorage.getItem('daycare_expenses');
    const savedIncomes = localStorage.getItem('daycare_incomes');

    if (savedAccounts && savedRefills && savedExpenses) {
      setAccounts(JSON.parse(savedAccounts));
      setRefills(JSON.parse(savedRefills));
      setExpenses(JSON.parse(savedExpenses));
      setIncomes(savedIncomes ? JSON.parse(savedIncomes) : []);
    } else {
      const mockData = generateMockData();
      setAccounts(mockData.accounts);
      setRefills(mockData.refills);
      setExpenses(mockData.expenses);
      setIncomes([]);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem('daycare_accounts', JSON.stringify(accounts));
      localStorage.setItem('daycare_refills', JSON.stringify(refills));
      localStorage.setItem('daycare_expenses', JSON.stringify(expenses));
      localStorage.setItem('daycare_incomes', JSON.stringify(incomes));
    }
  }, [accounts, refills, expenses, incomes, initialized]);

  const updateAccountBalance = (accountId: string, newBalance: number) => {
    setAccounts(
      accounts.map((acc) => (acc.id === accountId ? { ...acc, balance: newBalance } : acc))
    );
  };

  const getAccountBalance = (accountId: string) => {
    return accounts.find((acc) => acc.id === accountId)?.balance || 0;
  };

  const getTotalBalance = () => {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  };

  const addRefill = (refill: Omit<Refill, 'id'>) => {
    const newRefill: Refill = {
      ...refill,
      id: Date.now().toString(),
    };
    const currentBalance = getAccountBalance(refill.accountId);
    updateAccountBalance(refill.accountId, currentBalance + refill.amount);
    setRefills([newRefill, ...refills]);
  };

  const deleteRefill = (id: string) => {
    const refill = refills.find((r) => r.id === id);
    if (refill) {
      const currentBalance = getAccountBalance(refill.accountId);
      updateAccountBalance(refill.accountId, currentBalance - refill.amount);
      setRefills(refills.filter((r) => r.id !== id));
    }
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };

    if (expense.paymentSource === 'cash') {
      const cashBalance = getAccountBalance('1');
      updateAccountBalance('1', cashBalance - expense.debitDetails.cashAmount);
    } else if (expense.paymentSource === 'bank') {
      const bankBalance = getAccountBalance('2');
      updateAccountBalance('2', bankBalance - expense.debitDetails.bankAmount);
    } else {
      const cashBalance = getAccountBalance('1');
      const bankBalance = getAccountBalance('2');
      updateAccountBalance('1', cashBalance - expense.debitDetails.cashAmount);
      updateAccountBalance('2', bankBalance - expense.debitDetails.bankAmount);
    }

    setExpenses([newExpense, ...expenses]);
  };

  const updateExpense = (id: string, updatedExpense: Expense) => {
    const oldExpense = expenses.find((exp) => exp.id === id);
    if (oldExpense) {
      if (oldExpense.paymentSource === 'cash') {
        const cashBalance = getAccountBalance('1');
        updateAccountBalance('1', cashBalance + oldExpense.debitDetails.cashAmount);
      } else if (oldExpense.paymentSource === 'bank') {
        const bankBalance = getAccountBalance('2');
        updateAccountBalance('2', bankBalance + oldExpense.debitDetails.bankAmount);
      } else {
        const cashBalance = getAccountBalance('1');
        const bankBalance = getAccountBalance('2');
        updateAccountBalance('1', cashBalance + oldExpense.debitDetails.cashAmount);
        updateAccountBalance('2', bankBalance + oldExpense.debitDetails.bankAmount);
      }

      if (updatedExpense.paymentSource === 'cash') {
        const cashBalance = getAccountBalance('1');
        updateAccountBalance('1', cashBalance - updatedExpense.debitDetails.cashAmount);
      } else if (updatedExpense.paymentSource === 'bank') {
        const bankBalance = getAccountBalance('2');
        updateAccountBalance('2', bankBalance - updatedExpense.debitDetails.bankAmount);
      } else {
        const cashBalance = getAccountBalance('1');
        const bankBalance = getAccountBalance('2');
        updateAccountBalance('1', cashBalance - updatedExpense.debitDetails.cashAmount);
        updateAccountBalance('2', bankBalance - updatedExpense.debitDetails.bankAmount);
      }
    }

    setExpenses(expenses.map((exp) => (exp.id === id ? updatedExpense : exp)));
  };

  const deleteExpense = (id: string) => {
    const expense = expenses.find((exp) => exp.id === id);
    if (expense) {
      if (expense.paymentSource === 'cash') {
        const cashBalance = getAccountBalance('1');
        updateAccountBalance('1', cashBalance + expense.debitDetails.cashAmount);
      } else if (expense.paymentSource === 'bank') {
        const bankBalance = getAccountBalance('2');
        updateAccountBalance('2', bankBalance + expense.debitDetails.bankAmount);
      } else {
        const cashBalance = getAccountBalance('1');
        const bankBalance = getAccountBalance('2');
        updateAccountBalance('1', cashBalance + expense.debitDetails.cashAmount);
        updateAccountBalance('2', bankBalance + expense.debitDetails.bankAmount);
      }
      setExpenses(expenses.filter((exp) => exp.id !== id));
    }
  };

  const getTotalExpensesBySource = (source: 'cash' | 'bank' | 'both') => {
    return expenses
      .filter((exp) => exp.paymentSource === source)
      .reduce((sum, exp) => sum + exp.total, 0);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, exp) => sum + exp.total, 0);
  };

  const getTotalRefillsByAccount = (accountId: string) => {
    return refills
      .filter((ref) => ref.accountId === accountId)
      .reduce((sum, ref) => sum + ref.amount, 0);
  };

  const addIncome = (income: Omit<Income, 'id'>) => {
    const newIncome: Income = {
      ...income,
      id: Date.now().toString(),
    };

    if (income.paymentMethod === 'cash') {
      const cashBalance = getAccountBalance('1');
      updateAccountBalance('1', cashBalance + income.debitDetails.cashAmount);
    } else if (income.paymentMethod === 'bank') {
      const bankBalance = getAccountBalance('2');
      updateAccountBalance('2', bankBalance + income.debitDetails.bankAmount);
    } else {
      const cashBalance = getAccountBalance('1');
      const bankBalance = getAccountBalance('2');
      updateAccountBalance('1', cashBalance + income.debitDetails.cashAmount);
      updateAccountBalance('2', bankBalance + income.debitDetails.bankAmount);
    }

    setIncomes([newIncome, ...incomes]);
  };

  const updateIncome = (id: string, updatedIncome: Income) => {
    const oldIncome = incomes.find((inc) => inc.id === id);
    if (oldIncome) {
      if (oldIncome.paymentMethod === 'cash') {
        const cashBalance = getAccountBalance('1');
        updateAccountBalance('1', cashBalance - oldIncome.debitDetails.cashAmount);
      } else if (oldIncome.paymentMethod === 'bank') {
        const bankBalance = getAccountBalance('2');
        updateAccountBalance('2', bankBalance - oldIncome.debitDetails.bankAmount);
      } else {
        const cashBalance = getAccountBalance('1');
        const bankBalance = getAccountBalance('2');
        updateAccountBalance('1', cashBalance - oldIncome.debitDetails.cashAmount);
        updateAccountBalance('2', bankBalance - oldIncome.debitDetails.bankAmount);
      }

      if (updatedIncome.paymentMethod === 'cash') {
        const cashBalance = getAccountBalance('1');
        updateAccountBalance('1', cashBalance + updatedIncome.debitDetails.cashAmount);
      } else if (updatedIncome.paymentMethod === 'bank') {
        const bankBalance = getAccountBalance('2');
        updateAccountBalance('2', bankBalance + updatedIncome.debitDetails.bankAmount);
      } else {
        const cashBalance = getAccountBalance('1');
        const bankBalance = getAccountBalance('2');
        updateAccountBalance('1', cashBalance + updatedIncome.debitDetails.cashAmount);
        updateAccountBalance('2', bankBalance + updatedIncome.debitDetails.bankAmount);
      }
    }

    setIncomes(incomes.map((inc) => (inc.id === id ? updatedIncome : inc)));
  };

  const deleteIncome = (id: string) => {
    const income = incomes.find((inc) => inc.id === id);
    if (income) {
      if (income.paymentMethod === 'cash') {
        const cashBalance = getAccountBalance('1');
        updateAccountBalance('1', cashBalance - income.debitDetails.cashAmount);
      } else if (income.paymentMethod === 'bank') {
        const bankBalance = getAccountBalance('2');
        updateAccountBalance('2', bankBalance - income.debitDetails.bankAmount);
      } else {
        const cashBalance = getAccountBalance('1');
        const bankBalance = getAccountBalance('2');
        updateAccountBalance('1', cashBalance - income.debitDetails.cashAmount);
        updateAccountBalance('2', bankBalance - income.debitDetails.bankAmount);
      }
      setIncomes(incomes.filter((inc) => inc.id !== id));
    }
  };

  const getTotalIncome = () => {
    return incomes.reduce((sum, inc) => sum + inc.amount, 0);
  };

  const getTotalIncomeByMethod = (method: 'cash' | 'bank' | 'both') => {
    return incomes
      .filter((inc) => inc.paymentMethod === method)
      .reduce((sum, inc) => sum + inc.amount, 0);
  };

  return (
    <DataContext.Provider
      value={{
        accounts,
        updateAccountBalance,
        refills,
        addRefill,
        deleteRefill,
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        incomes,
        addIncome,
        updateIncome,
        deleteIncome,
        getAccountBalance,
        getTotalBalance,
        getTotalExpensesBySource,
        getTotalExpenses,
        getTotalRefillsByAccount,
        getTotalIncome,
        getTotalIncomeByMethod,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
