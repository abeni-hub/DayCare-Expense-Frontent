import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#f97316', '#3b82f6', '#a855f7'];

export function PaymentSourceChart() {
  const { getTotalExpensesBySource, getTotalExpenses } = useData();

  const sourceData = useMemo(() => {
    const total = getTotalExpenses();
    if (total === 0) return [];

    return [
      {
        name: 'Cash Only',
        value: getTotalExpensesBySource('cash'),
        color: COLORS[0],
      },
      {
        name: 'Bank Only',
        value: getTotalExpensesBySource('bank'),
        color: COLORS[1],
      },
      {
        name: 'Cash & Bank',
        value: getTotalExpensesBySource('both'),
        color: COLORS[2],
      },
    ].filter((item) => item.value > 0);
  }, [getTotalExpensesBySource, getTotalExpenses]);

  const total = getTotalExpenses();

  if (sourceData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <PieChartIcon className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Payment Source</h3>
            <p className="text-sm text-gray-500">Expense breakdown by payment method</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-48 text-gray-500">
          No expense data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <PieChartIcon className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Payment Source</h3>
          <p className="text-sm text-gray-500">Expense breakdown by payment method</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative pt-2">
          <div className="flex h-4 overflow-hidden rounded-full bg-gray-200">
            {sourceData.map((item, index) => (
              <div
                key={item.name}
                className="transition-all duration-500"
                style={{
                  width: `${(item.value / total) * 100}%`,
                  backgroundColor: item.color,
                }}
                title={`${item.name}: ${(item.value / total * 100).toFixed(1)}%`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {sourceData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {item.value.toLocaleString()} ETB
                </p>
                <p className="text-xs text-gray-500">{((item.value / total) * 100).toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Total Expenses</span>
            <span className="text-lg font-bold text-gray-900">{total.toLocaleString()} ETB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
