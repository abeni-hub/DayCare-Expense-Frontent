import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { BarChart3 } from 'lucide-react';

export function ExpenseChart() {
  const { expenses } = useData();

  const dailyData = useMemo(() => {
    const data: Record<string, number> = {};
    expenses.forEach((exp) => {
      const date = exp.date;
      data[date] = (data[date] || 0) + exp.total;
    });
    return Object.entries(data)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-14);
  }, [expenses]);

  const maxValue = Math.max(...dailyData.map(([, value]) => value), 1);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Expense Trend</h3>
          <p className="text-sm text-gray-500">Last 14 days with activity</p>
        </div>
      </div>

      {dailyData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          No expense data available
        </div>
      ) : (
        <div className="space-y-3">
          {dailyData.map(([date, value]) => {
            const percentage = (value / maxValue) * 100;
            return (
              <div key={date}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {value.toLocaleString()} ETB
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
