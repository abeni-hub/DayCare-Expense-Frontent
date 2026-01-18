import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Expense, ExpenseItem } from '../types';

interface ExpenseFormProps {
  expense?: Expense | null;
  onClose: () => void;
}

export function ExpenseForm({ expense, onClose }: ExpenseFormProps) {
  const { addExpense, updateExpense } = useData();
  const [paymentSource, setPaymentSource] = useState<'cash' | 'bank' | 'both'>('both');
  const [items, setItems] = useState<ExpenseItem[]>([
    { id: '1', name: '', quantity: 1, unit: 'kg', unitPrice: 0, total: 0 },
  ]);
  const [cashAmount, setCashAmount] = useState('0');
  const [bankAmount, setBankAmount] = useState('0');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Food',
    supplier: '',
    invoiceFile: '',
    remarks: '',
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        date: expense.date,
        description: expense.description,
        category: expense.category,
        supplier: expense.supplier,
        invoiceFile: expense.invoiceFile || '',
        remarks: expense.remarks,
      });
      setPaymentSource(expense.paymentSource);
      setItems(expense.items);
      setCashAmount(expense.debitDetails.cashAmount.toString());
      setBankAmount(expense.debitDetails.bankAmount.toString());
    }
  }, [expense]);

  const totalExpense = items.reduce((sum, item) => sum + item.total, 0);
  const totalDebit = parseFloat(cashAmount || '0') + parseFloat(bankAmount || '0');
  const isValidSplit = Math.abs(totalExpense - totalDebit) < 0.01;

  const handleAddItem = () => {
    const newItem: ExpenseItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      unit: 'kg',
      unitPrice: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleItemChange = (id: string, field: string, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      })
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, invoiceFile: file.name });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || !formData.supplier || items.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    if (!isValidSplit) {
      alert(
        `Payment split must equal total expense (Total: ${totalExpense}, Split: ${totalDebit})`
      );
      return;
    }

    const expenseData = {
      date: formData.date,
      description: formData.description,
      category: formData.category,
      supplier: formData.supplier,
      paymentSource,
      debitDetails: {
        cashAmount: parseFloat(cashAmount || '0'),
        bankAmount: parseFloat(bankAmount || '0'),
      },
      total: totalExpense,
      items,
      invoiceFile: formData.invoiceFile || undefined,
      remarks: formData.remarks,
    };

    if (expense) {
      updateExpense(expense.id, { ...expenseData, id: expense.id });
    } else {
      addExpense(expenseData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">
            {expense ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Supermarket Purchase"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Food</option>
                <option>Supplies</option>
                <option>Toys</option>
                <option>Utilities</option>
                <option>Maintenance</option>
                <option>Food & Supplies</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier *
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Local Market"
                required
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Expense Items</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item, index) => (
                <div key={item.id} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="text-xs text-gray-600">Item Name</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Item name"
                      required
                    />
                  </div>
                  <div className="w-20">
                    <label className="text-xs text-gray-600">Qty</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(item.id, 'quantity', parseFloat(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-xs text-gray-600">Unit</label>
                    <select
                      value={item.unit}
                      onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option>kg</option>
                      <option>pcs</option>
                      <option>boxes</option>
                      <option>sets</option>
                      <option>liters</option>
                      <option>rolls</option>
                      <option>lot</option>
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="text-xs text-gray-600">Unit Price</label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-xs text-gray-600">Total</label>
                    <input
                      type="text"
                      value={item.total.toFixed(2)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-100"
                      disabled
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="mt-3 flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>

            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total Expense:</span>
                <span className="text-lg font-bold text-blue-600">
                  {totalExpense.toFixed(2)} ETB
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Payment Source</h3>
            <div className="space-y-3">
              <div className="flex gap-4">
                {(['cash', 'bank', 'both'] as const).map((source) => (
                  <label key={source} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentSource"
                      value={source}
                      checked={paymentSource === source}
                      onChange={(e) => setPaymentSource(e.target.value as typeof source)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700 capitalize">{source}</span>
                  </label>
                ))}
              </div>

              {paymentSource === 'cash' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount from Cash (ETB)
                  </label>
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => {
                      setCashAmount(e.target.value);
                      setBankAmount('0');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              )}

              {paymentSource === 'bank' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount from Bank (ETB)
                  </label>
                  <input
                    type="number"
                    value={bankAmount}
                    onChange={(e) => {
                      setBankAmount(e.target.value);
                      setCashAmount('0');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              )}

              {paymentSource === 'both' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount from Cash (ETB)
                    </label>
                    <input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount from Bank (ETB)
                    </label>
                    <input
                      type="number"
                      value={bankAmount}
                      onChange={(e) => setBankAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}

              {!isValidSplit && (
                <div className="text-sm text-red-600 font-medium">
                  Payment split ({totalDebit.toFixed(2)} ETB) must equal total expense (
                  {totalExpense.toFixed(2)} ETB)
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Invoice
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="invoice-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="invoice-upload"
                  className="flex items-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                >
                  <Upload className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {formData.invoiceFile || 'Choose file...'}
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
              <input
                type="text"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Optional notes"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
              disabled={!isValidSplit}
            >
              {expense ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
