import { useState } from 'react';
import { Wallet, TrendingUp, AlertTriangle, Plus, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';
import { RefillModal } from './RefillModal';

export function BankAccount() {
  const {
    currentBalance,
    setCurrentBalance,
    refills,
    calculateExpectedBalance,
    getBankExpenses,
    getTotalRefills,
  } = useData();

  const [isEditing, setIsEditing] = useState(false);
  const [newBalance, setNewBalance] = useState(currentBalance.toString());
  const [showRefillModal, setShowRefillModal] = useState(false);

  const expectedBalance = calculateExpectedBalance();
  const totalRefills = getTotalRefills();
  const totalBankExpenses = getBankExpenses();
  const balanceMismatch = Math.abs(expectedBalance - currentBalance) > 0.01;

  const handleSaveBalance = () => {
    const balance = parseFloat(newBalance);
    if (!isNaN(balance) && balance >= 0) {
      setCurrentBalance(balance);
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-700">Current Balance</h3>
            </div>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="number"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                step="0.01"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveBalance}
                  className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setNewBalance(currentBalance.toString());
                  }}
                  className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {currentBalance.toLocaleString()} ETB
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Update Balance
              </button>
            </>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-700">Total Refills</h3>
          </div>
          <p className="text-3xl font-bold text-green-600 mb-2">
            +{totalRefills.toLocaleString()} ETB
          </p>
          <p className="text-sm text-gray-500">{refills.length} deposits</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-red-600 rotate-180" />
            </div>
            <h3 className="font-semibold text-gray-700">Bank Expenses</h3>
          </div>
          <p className="text-3xl font-bold text-red-600 mb-2">
            -{totalBankExpenses.toLocaleString()} ETB
          </p>
          <p className="text-sm text-gray-500">Paid via bank</p>
        </div>

        <div
          className={`bg-white rounded-xl shadow-sm border-2 p-6 ${
            balanceMismatch ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className={`p-2 rounded-lg ${balanceMismatch ? 'bg-red-100' : 'bg-green-100'}`}>
              <AlertTriangle
                className={`w-5 h-5 ${balanceMismatch ? 'text-red-600' : 'text-green-600'}`}
              />
            </div>
            <h3 className="font-semibold text-gray-700">Expected Balance</h3>
          </div>
          <p
            className={`text-3xl font-bold mb-2 ${
              balanceMismatch ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {expectedBalance.toLocaleString()} ETB
          </p>
          {balanceMismatch && (
            <p className="text-sm text-red-700 font-medium">
              Mismatch: {(expectedBalance - currentBalance).toLocaleString()} ETB
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Refill History</h2>
          <button
            onClick={() => setShowRefillModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add Refill
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {refills.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No refills recorded yet
                  </td>
                </tr>
              ) : (
                refills.map((refill) => (
                  <tr key={refill.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(refill.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-green-600">
                        +{refill.amount.toLocaleString()} ETB
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{refill.method}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{refill.notes}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showRefillModal && <RefillModal onClose={() => setShowRefillModal(false)} />}
    </div>
  );
}
