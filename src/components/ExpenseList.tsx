import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Edit2, Trash2, FileText, AlertCircle, Search, Filter } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Expense } from '../types';
import { ExpenseForm } from './ExpenseForm';

export function ExpenseList() {
  const { expenses, deleteExpense } = useData();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const categories = [
    'All',
    'Food',
    'Supplies',
    'Toys',
    'Utilities',
    'Maintenance',
    'Food & Supplies',
    'Other',
  ];

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch =
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.items.some((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory = categoryFilter === 'All' || expense.category === categoryFilter;

      const matchesDateRange =
        (!dateRange.from || expense.date >= dateRange.from) &&
        (!dateRange.to || expense.date <= dateRange.to);

      return matchesSearch && matchesCategory && matchesDateRange;
    });
  }, [expenses, searchTerm, categoryFilter, dateRange]);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const getPaymentBadgeColor = (source: string) => {
    switch (source) {
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
          <h2 className="text-xl font-bold text-gray-900">Expense Management</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FileText className="w-4 h-4" />
            Add Expense
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by description or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="From date"
          />

          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="To date"
          />
        </div>

        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <span className="font-medium">
            Showing {filteredExpenses.length} of {expenses.length} expenses
          </span>
          <span>|</span>
          <span>
            Total: {filteredExpenses.reduce((sum, exp) => sum + exp.total, 0).toLocaleString()}{' '}
            ETB
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {filteredExpenses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No expenses found</p>
          </div>
        ) : (
          filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              <button
                onClick={() =>
                  setExpandedId(expandedId === expense.id ? null : expense.id)
                }
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4 flex-1 text-left">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{expense.description}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentBadgeColor(
                          expense.paymentSource
                        )}`}
                      >
                        {expense.paymentSource.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                        {expense.category}
                      </span>
                      <span>•</span>
                      <span>{expense.supplier}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right mr-2">
                    <p className="text-lg font-bold text-gray-900">
                      {expense.total.toLocaleString()} ETB
                    </p>
                    <p className="text-xs text-gray-500">{expense.items.length} items</p>
                  </div>
                  {expandedId === expense.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {expandedId === expense.id && (
                <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Expense Items</h4>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100 border-b border-gray-200">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">
                              Item
                            </th>
                            <th className="px-3 py-2 text-center font-medium text-gray-700">
                              Qty
                            </th>
                            <th className="px-3 py-2 text-center font-medium text-gray-700">
                              Unit
                            </th>
                            <th className="px-3 py-2 text-right font-medium text-gray-700">
                              Price
                            </th>
                            <th className="px-3 py-2 text-right font-medium text-gray-700">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {expense.items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-3 py-2">{item.name}</td>
                              <td className="px-3 py-2 text-center">{item.quantity}</td>
                              <td className="px-3 py-2 text-center">{item.unit}</td>
                              <td className="px-3 py-2 text-right">
                                {item.unitPrice.toLocaleString()}
                              </td>
                              <td className="px-3 py-2 text-right font-semibold">
                                {item.total.toLocaleString()} ETB
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Payment Breakdown</p>
                      {expense.debitDetails.cashAmount > 0 && (
                        <p className="text-sm text-orange-600 font-semibold mb-1">
                          Cash: {expense.debitDetails.cashAmount.toLocaleString()} ETB
                        </p>
                      )}
                      {expense.debitDetails.bankAmount > 0 && (
                        <p className="text-sm text-blue-600 font-semibold">
                          Bank: {expense.debitDetails.bankAmount.toLocaleString()} ETB
                        </p>
                      )}
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">Invoice Status</p>
                      {expense.invoiceFile ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm font-medium">{expense.invoiceFile}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Missing</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">Remarks</p>
                      <p className="text-sm text-gray-700">{expense.remarks || 'None'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded transition text-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded transition text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showForm && <ExpenseForm expense={editingExpense} onClose={handleCloseForm} />}
    </div>
  );
}
