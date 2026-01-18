import { Wallet, DollarSign, TrendingUp } from 'lucide-react';
import { useData } from '../context/DataContext';

export function AccountSummary() {
  const { accounts, getAccountBalance, getTotalBalance } = useData();

  const cashAccount = accounts.find((acc) => acc.type === 'cash');
  const bankAccount = accounts.find((acc) => acc.type === 'bank');
  const totalBalance = getTotalBalance();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold bg-white bg-opacity-20 px-2 py-1 rounded">
              CASH
            </span>
          </div>
          <p className="text-orange-100 text-sm font-medium mb-1">Cash Account</p>
          <p className="text-4xl font-bold">
            {getAccountBalance(cashAccount?.id || '1').toLocaleString()} ETB
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
          <p className="text-blue-100 text-sm font-medium mb-1">Bank Account</p>
          <p className="text-4xl font-bold">
            {getAccountBalance(bankAccount?.id || '2').toLocaleString()} ETB
          </p>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold bg-white bg-opacity-20 px-2 py-1 rounded">
              TOTAL
            </span>
          </div>
          <p className="text-teal-100 text-sm font-medium mb-1">Combined Total Funds</p>
          <p className="text-4xl font-bold">{totalBalance.toLocaleString()} ETB</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cashAccount && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Wallet className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Cash Account Details</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Account ID</span>
                <span className="text-sm font-semibold text-gray-900">{cashAccount.id}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Account Type</span>
                <span className="text-sm font-semibold text-gray-900 capitalize">
                  {cashAccount.type}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Current Balance</span>
                <span className="text-lg font-bold text-orange-600">
                  {cashAccount.balance.toLocaleString()} ETB
                </span>
              </div>
            </div>
          </div>
        )}

        {bankAccount && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Bank Account Details</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Account ID</span>
                <span className="text-sm font-semibold text-gray-900">{bankAccount.id}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Account Type</span>
                <span className="text-sm font-semibold text-gray-900 capitalize">
                  {bankAccount.type}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Current Balance</span>
                <span className="text-lg font-bold text-blue-600">
                  {bankAccount.balance.toLocaleString()} ETB
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
