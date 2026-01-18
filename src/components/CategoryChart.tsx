import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { PieChart } from 'lucide-react';

const COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-pink-500',
];

export function CategoryChart() {
  const { expenses } = useData();

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    expenses.forEach((exp) => {
      data[exp.category] = (data[exp.category] || 0) + exp.total;
    });
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    return Object.entries(data)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / total) * 100,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const total = categoryData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <PieChart className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">By Category</h3>
          <p className="text-sm text-gray-500">Expense breakdown</p>
        </div>
      </div>

      {categoryData.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-500">No data available</div>
      ) : (
        <div className="space-y-4">
          <div className="relative pt-1">
            <div className="flex h-3 overflow-hidden rounded-full bg-gray-200">
              {categoryData.map((item, index) => (
                <div
                  key={item.category}
                  className={`${COLORS[index % COLORS.length]} transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.category}: ${item.percentage.toFixed(1)}%`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {categoryData.map((item, index) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${COLORS[index % COLORS.length]}`} />
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {item.amount.toLocaleString()} ETB
                  </p>
                  <p className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Total</span>
              <span className="text-lg font-bold text-gray-900">{total.toLocaleString()} ETB</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
