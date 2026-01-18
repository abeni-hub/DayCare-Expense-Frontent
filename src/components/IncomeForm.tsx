import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Income } from '../types';

interface IncomeFormProps {
  income?: Income | null;
  onClose: () => void;
}

export function IncomeForm({ income, onClose }: IncomeFormProps) {
  const { addIncome, updateIncome } = useData();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank' | 'both'>('bank');
  const [cashAmount, setCashAmount] = useState('0');
  const [bankAmount, setBankAmount] = useState('0');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    source: '',
    category: 'Parent Fees',
    receiptFile: '',
    remarks: '',
  });

  useEffect(() => {
    if (income) {
      setFormData({
        date: income.date,
        description: income.description,
        amount: income.amount.toString(),
        source: income.source,
        category: income.category,
        receiptFile: income.receiptFile || '',
        remarks: income.remarks,
      });
      setPaymentMethod(income.paymentMethod);
      setCashAmount(income.debitDetails.cashAmount.toString());
      setBankAmount(income.debitDetails.bankAmount.toString());
    }
  }, [income]);

  const totalIncome = parseFloat(formData.amount || '0');
  const totalDebit = parseFloat(cashAmount || '0') + parseFloat(bankAmount || '0');
  const isValidSplit = Math.abs(totalIncome - totalDebit) < 0.01;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, receiptFile: file.name });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || !formData.source || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    if (!isValidSplit) {
      alert(
        `Payment split must equal total income (Total: ${totalIncome}, Split: ${totalDebit})`
      );
      return;
    }

    const incomeData = {
      date: formData.date,
      description: formData.description,
      amount: totalIncome,
      source: formData.source,
      category: formData.category,
      paymentMethod,
      debitDetails: {
        cashAmount: parseFloat(cashAmount || '0'),
        bankAmount: parseFloat(bankAmount || '0'),
      },
      receiptFile: formData.receiptFile || undefined,
      remarks: formData.remarks,
    };

    if (income) {
      updateIncome(income.id, { ...incomeData, id: income.id });
    } else {
      addIncome(incomeData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">
            {income ? 'Edit Income' : 'Add New Income'}
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
                placeholder="e.g., Monthly Parent Fees"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (ETB) *</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => {
                  setFormData({ ...formData, amount: e.target.value });
                  if (paymentMethod === 'cash') {
                    setCashAmount(e.target.value);
                  } else if (paymentMethod === 'bank') {
                    setBankAmount(e.target.value);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source *</label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Parent: John Doe"
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
                <option>Parent Fees</option>
                <option>Government Grant</option>
                <option>Donations</option>
                <option>Fundraising</option>
                <option>Registration Fees</option>
                <option>Field Trip Fees</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Payment Method</h3>
            <div className="space-y-3">
              <div className="flex gap-4">
                {(['cash', 'bank', 'both'] as const).map((method) => (
                  <label key={method} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => {
                        const newMethod = e.target.value as typeof method;
                        setPaymentMethod(newMethod);
                        const amount = formData.amount || '0';
                        if (newMethod === 'cash') {
                          setCashAmount(amount);
                          setBankAmount('0');
                        } else if (newMethod === 'bank') {
                          setBankAmount(amount);
                          setCashAmount('0');
                        }
                      }}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700 capitalize">{method}</span>
                  </label>
                ))}
              </div>

              {paymentMethod === 'cash' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to Cash (ETB)
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

              {paymentMethod === 'bank' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to Bank (ETB)
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

              {paymentMethod === 'both' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount to Cash (ETB)
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
                      Amount to Bank (ETB)
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
                  Payment split ({totalDebit.toFixed(2)} ETB) must equal total income (
                  {totalIncome.toFixed(2)} ETB)
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Receipt
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="receipt-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="receipt-upload"
                  className="flex items-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                >
                  <Upload className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {formData.receiptFile || 'Choose file...'}
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
              {income ? 'Update Income' : 'Add Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
