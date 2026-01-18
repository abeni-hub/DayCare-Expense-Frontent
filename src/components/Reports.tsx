import { useState, useMemo } from 'react';
import { Download, FileText, Calendar, DollarSign } from 'lucide-react';
import { useData } from '../context/DataContext';
import { exportToCSV } from '../utils/export';

export function Reports() {
  const { expenses, refills, incomes, getTotalBalance } = useData();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const monthlyData = useMemo(() => {
    const monthExpenses = expenses.filter((exp) => exp.date.startsWith(selectedMonth));
    const monthRefills = refills.filter((ref) => ref.date.startsWith(selectedMonth));
    const monthIncomes = incomes.filter((inc) => inc.date.startsWith(selectedMonth));

    const totalExpenses = monthExpenses.reduce((sum, exp) => sum + exp.total, 0);
    const totalRefills = monthRefills.reduce((sum, ref) => sum + ref.amount, 0);
    const totalIncome = monthIncomes.reduce((sum, inc) => sum + inc.amount, 0);

    const bankExpenses = monthExpenses
      .filter((exp) => exp.paymentSource === 'bank')
      .reduce((sum, exp) => sum + exp.total, 0);
    const cashExpenses = monthExpenses
      .filter((exp) => exp.paymentSource === 'cash')
      .reduce((sum, exp) => sum + exp.total, 0);
    const bothExpenses = monthExpenses
      .filter((exp) => exp.paymentSource === 'both')
      .reduce((sum, exp) => sum + exp.total, 0);

    const categoryBreakdown: Record<string, number> = {};
    monthExpenses.forEach((exp) => {
      categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + exp.total;
    });

    const incomeCategoryBreakdown: Record<string, number> = {};
    monthIncomes.forEach((inc) => {
      incomeCategoryBreakdown[inc.category] = (incomeCategoryBreakdown[inc.category] || 0) + inc.amount;
    });

    return {
      monthExpenses,
      monthRefills,
      monthIncomes,
      totalExpenses,
      totalRefills,
      totalIncome,
      bankExpenses,
      cashExpenses,
      bothExpenses,
      categoryBreakdown,
      incomeCategoryBreakdown,
      netChange: totalIncome + totalRefills - totalExpenses,
    };
  }, [expenses, refills, incomes, selectedMonth]);

  const handleExportExpenses = () => {
    const data = monthlyData.monthExpenses.map((exp) => ({
      Date: exp.date,
      Description: exp.description,
      Category: exp.category,
      Supplier: exp.supplier,
      'Payment Source': exp.paymentSource,
      'Total Amount': exp.total,
      'Cash Amount': exp.debitDetails.cashAmount,
      'Bank Amount': exp.debitDetails.bankAmount,
      Invoice: exp.invoiceFile || 'Missing',
      Remarks: exp.remarks,
    }));
    exportToCSV(data, `expenses_${selectedMonth}.csv`);
  };

  const handleExportIncome = () => {
    const data = monthlyData.monthIncomes.map((inc) => ({
      Date: inc.date,
      Description: inc.description,
      Amount: inc.amount,
      Source: inc.source,
      Category: inc.category,
      'Payment Method': inc.paymentMethod,
      'Cash Amount': inc.debitDetails.cashAmount,
      'Bank Amount': inc.debitDetails.bankAmount,
      Receipt: inc.receiptFile || 'Missing',
      Remarks: inc.remarks,
    }));
    exportToCSV(data, `income_${selectedMonth}.csv`);
  };

  const handleExportRefills = () => {
    const data = monthlyData.monthRefills.map((ref) => ({
      Date: ref.date,
      Amount: ref.amount,
      Method: ref.method,
      Notes: ref.notes,
    }));
    exportToCSV(data, `refills_${selectedMonth}.csv`);
  };

  const handleExportSummary = () => {
    const data = [
      { Item: 'Total Balance', Value: getTotalBalance() + ' ETB' },
      { Item: 'Total Income', Value: monthlyData.totalIncome + ' ETB' },
      { Item: 'Total Refills', Value: monthlyData.totalRefills + ' ETB' },
      { Item: 'Total Expenses', Value: monthlyData.totalExpenses + ' ETB' },
      { Item: 'Cash Expenses', Value: monthlyData.cashExpenses + ' ETB' },
      { Item: 'Bank Expenses', Value: monthlyData.bankExpenses + ' ETB' },
      { Item: 'Both Expenses', Value: monthlyData.bothExpenses + ' ETB' },
      { Item: 'Net Change', Value: monthlyData.netChange + ' ETB' },
      { Item: '', Value: '' },
      { Item: 'Expense Categories', Value: '' },
      ...Object.entries(monthlyData.categoryBreakdown).map(([cat, amount]) => ({
        Item: cat,
        Value: amount + ' ETB',
      })),
      { Item: '', Value: '' },
      { Item: 'Income Categories', Value: '' },
      ...Object.entries(monthlyData.incomeCategoryBreakdown).map(([cat, amount]) => ({
        Item: cat,
        Value: amount + ' ETB',
      })),
    ];
    exportToCSV(data, `summary_${selectedMonth}.csv`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Reports & Export</h2>
            <p className="text-sm text-gray-600 mt-1">
              Generate and download financial reports
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={handleExportIncome}
            className="flex items-center justify-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition group"
          >
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Export Income</p>
              <p className="text-xs text-gray-500">CSV format</p>
            </div>
            <Download className="w-4 h-4 text-gray-400 ml-auto" />
          </button>

          <button
            onClick={handleExportExpenses}
            className="flex items-center justify-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition group"
          >
            <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Export Expenses</p>
              <p className="text-xs text-gray-500">CSV format</p>
            </div>
            <Download className="w-4 h-4 text-gray-400 ml-auto" />
          </button>

          <button
            onClick={handleExportRefills}
            className="flex items-center justify-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
          >
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Export Refills</p>
              <p className="text-xs text-gray-500">CSV format</p>
            </div>
            <Download className="w-4 h-4 text-gray-400 ml-auto" />
          </button>

          <button
            onClick={handleExportSummary}
            className="flex items-center justify-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition group"
          >
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Export Summary</p>
              <p className="text-xs text-gray-500">CSV format</p>
            </div>
            <Download className="w-4 h-4 text-gray-400 ml-auto" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Income</span>
              <span className="text-sm font-semibold text-green-600">
                +{monthlyData.totalIncome.toLocaleString()} ETB
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Refills</span>
              <span className="text-sm font-semibold text-blue-600">
                +{monthlyData.totalRefills.toLocaleString()} ETB
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Expenses</span>
              <span className="text-sm font-semibold text-red-600">
                -{monthlyData.totalExpenses.toLocaleString()} ETB
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Cash Expenses</span>
              <span className="text-sm font-semibold text-gray-900">
                {monthlyData.cashExpenses.toLocaleString()} ETB
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Bank Expenses</span>
              <span className="text-sm font-semibold text-gray-900">
                {monthlyData.bankExpenses.toLocaleString()} ETB
              </span>
            </div>
            <div className="flex items-center justify-between py-2 pt-3">
              <span className="text-sm font-bold text-gray-900">Net Change</span>
              <span
                className={`text-lg font-bold ${
                  monthlyData.netChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {monthlyData.netChange >= 0 ? '+' : ''}
                {monthlyData.netChange.toLocaleString()} ETB
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Category Breakdown</h3>
          {Object.keys(monthlyData.categoryBreakdown).length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No expenses for this month
            </p>
          ) : (
            <div className="space-y-3">
              {Object.entries(monthlyData.categoryBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => {
                  const percentage = (amount / monthlyData.totalExpenses) * 100;
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{category}</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {amount.toLocaleString()} ETB ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Description
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...monthlyData.monthExpenses, ...monthlyData.monthRefills]
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 10)
                .map((item, index) => {
                  const isExpense = 'itemName' in item;
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            isExpense
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {isExpense ? 'Expense' : 'Refill'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {isExpense ? item.itemName : item.notes}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`text-sm font-semibold ${
                            isExpense ? 'text-red-600' : 'text-green-600'
                          }`}
                        >
                          {isExpense ? '-' : '+'}
                          {(isExpense ? item.totalPrice : item.amount).toLocaleString()} ETB
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
