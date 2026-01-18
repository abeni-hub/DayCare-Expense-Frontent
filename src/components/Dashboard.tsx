import { useMemo } from 'react';
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Wallet,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { ExpenseChart } from './ExpenseChart';
import { CategoryChart } from './CategoryChart';
import { PaymentSourceChart } from './PaymentSourceChart';

export function Dashboard() {
  const {
    accounts,
    expenses,
    refills,
    incomes,
    getTotalBalance,
    getTotalExpenses,
    getTotalExpensesBySource,
    getTotalRefillsByAccount,
    getTotalIncome,
  } = useData();

  const cashAccount = accounts.find((acc) => acc.type === 'cash');
  const bankAccount = accounts.find((acc) => acc.type === 'bank');
  const totalBalance = getTotalBalance();
  const totalExpenses = getTotalExpenses();
  const totalIncome = getTotalIncome();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyExpenses = expenses
    .filter((exp) => exp.date.startsWith(currentMonth))
    .reduce((sum, exp) => sum + exp.total, 0);

  const monthlyIncome = incomes
    .filter((inc) => inc.date.startsWith(currentMonth))
    .reduce((sum, inc) => sum + inc.amount, 0);

  const monthlyRefillsBank = getTotalRefillsByAccount(bankAccount?.id || '2');
  const monthlyRefillsCash = getTotalRefillsByAccount(cashAccount?.id || '1');
  const monthlyRefills = monthlyRefillsBank + monthlyRefillsCash;

  const missingInvoices = expenses.filter((exp) => !exp.invoiceFile).length;
  const missingReceipts = incomes.filter((inc) => !inc.receiptFile).length;

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    expenses.forEach((exp) => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.total;
    });
    return totals;
  }, [expenses]);

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const cashExpenses = getTotalExpensesBySource('cash');
  const bankExpenses = getTotalExpensesBySource('bank');
  const bothExpenses = getTotalExpensesBySource('both');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">
          Welcome back! Here's your daycare financial summary for{' '}
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold bg-white bg-opacity-20 px-2 py-1 rounded">
              CASH
            </span>
          </div>
          <p className="text-orange-100 text-sm font-medium mb-1">Cash Balance</p>
          <p className="text-3xl font-bold">
            {cashAccount?.balance.toLocaleString() || 0} ETB
          </p>
          <p className="text-orange-100 text-xs mt-2">
            {cashAccount ? `${accounts.length} account${accounts.length > 1 ? 's' : ''}` : 'N/A'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold bg-white bg-opacity-20 px-2 py-1 rounded">
              BANK
            </span>
          </div>
          <p className="text-blue-100 text-sm font-medium mb-1">Bank Balance</p>
          <p className="text-3xl font-bold">
            {bankAccount?.balance.toLocaleString() || 0} ETB
          </p>
          <p className="text-blue-100 text-xs mt-2">Primary account</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold bg-white bg-opacity-20 px-2 py-1 rounded">
              MONTH
            </span>
          </div>
          <p className="text-green-100 text-sm font-medium mb-1">Monthly Deposits</p>
          <p className="text-3xl font-bold">+{monthlyRefills.toLocaleString()} ETB</p>
          <p className="text-green-100 text-xs mt-2">{refills.length} total transactions</p>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold bg-white bg-opacity-20 px-2 py-1 rounded">
              TOTAL
            </span>
          </div>
          <p className="text-teal-100 text-sm font-medium mb-1">Combined Funds</p>
          <p className="text-3xl font-bold">{totalBalance.toLocaleString()} ETB</p>
          <p className="text-teal-100 text-xs mt-2">All accounts combined</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold bg-white bg-opacity-20 px-2 py-1 rounded">
              INCOME
            </span>
          </div>
          <p className="text-green-100 text-sm font-medium mb-1">Monthly Income</p>
          <p className="text-3xl font-bold">+{monthlyIncome.toLocaleString()} ETB</p>
          <p className="text-green-100 text-xs mt-2">Total: +{totalIncome.toLocaleString()} ETB</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold bg-white bg-opacity-20 px-2 py-1 rounded">
              EXPENSES
            </span>
          </div>
          <p className="text-red-100 text-sm font-medium mb-1">Monthly Expenses</p>
          <p className="text-3xl font-bold">-{monthlyExpenses.toLocaleString()} ETB</p>
          <p className="text-red-100 text-xs mt-2">Total: -{totalExpenses.toLocaleString()} ETB</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Net Income</h3>
              <p className="text-sm text-gray-600">This month</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Income</span>
              <span className="text-sm font-bold text-green-600">
                +{monthlyIncome.toLocaleString()} ETB
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Expenses</span>
              <span className="text-sm font-bold text-red-600">
                -{monthlyExpenses.toLocaleString()} ETB
              </span>
            </div>
            <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">Net</span>
              <span className={`text-lg font-bold ${
                (monthlyIncome - monthlyExpenses) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(monthlyIncome - monthlyExpenses) >= 0 ? '+' : ''}
                {(monthlyIncome - monthlyExpenses).toLocaleString()} ETB
              </span>
            </div>
          </div>
        </div>
      </div>

      {(missingInvoices > 0 || missingReceipts > 0) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-yellow-800">Document Alerts</h3>
              {missingInvoices > 0 && (
                <p className="text-sm text-yellow-700 mt-1">
                  {missingInvoices} expense{missingInvoices > 1 ? 's' : ''} missing invoice uploads.
                </p>
              )}
              {missingReceipts > 0 && (
                <p className="text-sm text-yellow-700 mt-1">
                  {missingReceipts} income record{missingReceipts > 1 ? 's' : ''} missing receipt uploads.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExpenseChart />
        </div>
        <div>
          <CategoryChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentSourceChart />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Transactions</span>
              <span className="text-lg font-bold text-gray-900">
                {expenses.length + refills.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="text-lg font-bold text-gray-900">
                {expenses.filter((e) => e.date.startsWith(currentMonth)).length +
                  refills.filter((r) => r.date.startsWith(currentMonth)).length}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-600">Categories Used</span>
              <span className="text-lg font-bold text-gray-900">
                {Object.keys(categoryTotals).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg per Expense</span>
              <span className="text-lg font-bold text-gray-900">
                {expenses.length > 0
                  ? (totalExpenses / expenses.length).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })
                  : 0}{' '}
                ETB
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-600">Top Category</span>
              <span className="text-lg font-bold text-gray-900">
                {topCategory ? topCategory[0] : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
