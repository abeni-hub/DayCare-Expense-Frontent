import { useState, useMemo } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, FileText, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Income } from '../types';
import { IncomeForm } from './IncomeForm';

export function IncomeList() {
  const { incomes, deleteIncome } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const categories = [
    'All',
    'Parent Fees',
    'Government Grant',
    'Donations',
    'Fundraising',
    'Registration Fees',
    'Field Trip Fees',
    'Other',
  ];

  const filteredIncomes = useMemo(() => {
    return incomes.filter((income) => {
      const matchesSearch =
        income.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        income.source.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'All' || income.category === categoryFilter;

      const matchesDateRange =
        (!dateRange.from || income.date >= dateRange.from) &&
        (!dateRange.to || income.date <= dateRange.to);

      return matchesSearch && matchesCategory && matchesDateRange;
    });
  }, [incomes, searchTerm, categoryFilter, dateRange]);

  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      deleteIncome(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingIncome(null);
  };

  const getPaymentBadgeColor = (method: string) => {
    switch (method) {
      case 'cash':
        return 'bg-orange-100 text-orange-700';
      case 'bank':
        return 'bg-blue-100 text-blue-700';
      case 'both':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Income Management</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add Income
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by description or source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="From date"
          />

          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="To date"
          />
        </div>

        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <span className="font-medium">
            Showing {filteredIncomes.length} of {incomes.length} income records
          </span>
          <span>|</span>
          <span>
            Total: {filteredIncomes.reduce((sum, inc) => sum + inc.amount, 0).toLocaleString()}{' '}
            ETB
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Receipt
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIncomes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No income records found
                  </td>
                </tr>
              ) : (
                filteredIncomes.map((income) => (
                  <tr key={income.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(income.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{income.description}</div>
                      {income.remarks && (
                        <div className="text-xs text-gray-500 mt-1">{income.remarks}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{income.source}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">
                        +{income.amount.toLocaleString()} ETB
                      </div>
                      {income.paymentMethod === 'both' && (
                        <div className="text-xs text-gray-500 mt-1">
                          Cash: {income.debitDetails.cashAmount.toLocaleString()} | Bank:{' '}
                          {income.debitDetails.bankAmount.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        {income.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentBadgeColor(
                          income.paymentMethod
                        )}`}
                      >
                        {income.paymentMethod.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {income.receiptFile ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <FileText className="w-4 h-4" />
                          <span className="text-xs">Yes</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-xs">No</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(income)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(income.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && <IncomeForm income={editingIncome} onClose={handleCloseForm} />}
    </div>
  );
}
