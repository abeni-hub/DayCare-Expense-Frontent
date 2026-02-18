import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

function DashboardPage({ accounts, expenses, incomes }) {
  // Calculations
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalIncome = incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.total || exp.amount || 0), 0);
  const netProfit = totalIncome - totalExpenses;

  // Chart Data
  const barData = [
    { name: "Income", amount: totalIncome, fill: "#10b981" },
    { name: "Expenses", amount: totalExpenses, fill: "#ef4444" },
  ];

  const expenseByAccount = accounts.map((account) => {
    const total = expenses
      .filter((exp) => (exp.paymentSource || exp.account) === account.name)
      .reduce((sum, exp) => sum + (exp.total || exp.amount || 0), 0);

    return { name: account.name, value: total };
  });

  const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981"];

  // Reusable Styles
  const cardStyle = {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "16px",
    flex: "1 1 240px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    border: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  const chartContainerStyle = {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
    border: "1px solid #f1f5f9",
    flex: "1 1 450px",
    minHeight: "400px",
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease-in-out" }}>
      <header style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
          Financial Overview
        </h1>
        <p style={{ color: "#64748b", marginTop: "4px" }}>Monitor your daycare's financial health in real-time.</p>
      </header>

      {/* SUMMARY CARDS */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "40px" }}>
        <div style={cardStyle}>
          <span style={{ color: "#64748b", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>Total Balance</span>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#1e293b", marginTop: "8px" }}>
            {totalBalance.toLocaleString()} <span style={{ fontSize: "16px", color: "#94a3b8" }}>ETB</span>
          </div>
        </div>

        <div style={{ ...cardStyle, borderLeft: "4px solid #10b981" }}>
          <span style={{ color: "#10b981", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>Total Income</span>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#065f46", marginTop: "8px" }}>
            {totalIncome.toLocaleString()} <span style={{ fontSize: "16px", color: "#94a3b8" }}>ETB</span>
          </div>
        </div>

        <div style={{ ...cardStyle, borderLeft: "4px solid #ef4444" }}>
          <span style={{ color: "#ef4444", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>Total Expenses</span>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#991b1b", marginTop: "8px" }}>
            {totalExpenses.toLocaleString()} <span style={{ fontSize: "16px", color: "#94a3b8" }}>ETB</span>
          </div>
        </div>

        <div style={{
          ...cardStyle,
          background: netProfit >= 0 ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          color: "#fff"
        }}>
          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>Net Profit</span>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#fff", marginTop: "8px" }}>
            {netProfit.toLocaleString()} <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)" }}>ETB</span>
          </div>
        </div>
      </div>

      {/* CHART SECTION */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>

        {/* BAR CHART */}
        <div style={chartContainerStyle}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "24px" }}>Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div style={chartContainerStyle}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "24px" }}>Expenses by Account</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseByAccount}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                stroke="none"
              >
                {expenseByAccount.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;