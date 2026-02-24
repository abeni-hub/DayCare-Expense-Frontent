import React, { useState, useEffect } from "react";
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

import { getIncomes } from "../../apis/incomes.api";
import { getExpenses } from "../../apis/expenses.api";
import { getAccounts } from "../../apis/accounts.api";   // Make sure this file exists

function DashboardPage() {
  const [accounts, setAccounts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accData, expData, incData] = await Promise.all([
          getAccounts(),
          getExpenses(),
          getIncomes()
        ]);

        setAccounts(accData);
        setExpenses(expData.results || expData);
        setIncomes(incData.results || incData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div style={{ padding: "50px", textAlign: "center", fontSize: "18px" }}>Loading financial overview...</div>;

  // FIXED: Exclude the virtual "combined" account to prevent double counting
  const realAccounts = accounts.filter(acc => acc.account_type !== "combined" && acc.id !== "combined");

  const totalBalance = realAccounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0);
  const totalIncome = incomes.reduce((sum, inc) => sum + Number(inc.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.total_expense || 0), 0);
  const netProfit = totalIncome - totalExpenses;

  // Cash & Bank Breakdown (supports combined)
  const cashIncome = incomes.reduce((sum, inc) => {
    if (inc.payment_source === "cash") return sum + Number(inc.amount || 0);
    if (inc.payment_source === "combined") return sum + Number(inc.amount_cash || 0);
    return sum;
  }, 0);

  const bankIncome = incomes.reduce((sum, inc) => {
    if (inc.payment_source === "bank") return sum + Number(inc.amount || 0);
    if (inc.payment_source === "combined") return sum + Number(inc.amount_bank || 0);
    return sum;
  }, 0);

  const cashExpense = expenses.reduce((sum, exp) => {
    if (exp.payment_source === "cash") return sum + Number(exp.total_expense || 0);
    if (exp.payment_source === "combined") return sum + Number(exp.amount_cash || 0);
    return sum;
  }, 0);

  const bankExpense = expenses.reduce((sum, exp) => {
    if (exp.payment_source === "bank") return sum + Number(exp.total_expense || 0);
    if (exp.payment_source === "combined") return sum + Number(exp.amount_bank || 0);
    return sum;
  }, 0);

  // Charts
  const barData = [
    { name: "Income", amount: totalIncome, fill: "#10b981" },
    { name: "Expenses", amount: totalExpenses, fill: "#ef4444" },
  ];

  const pieData = [
    { name: "Cash", value: cashExpense },
    { name: "Bank", value: bankExpense },
  ];

  const COLORS = ["#3b82f6", "#8b5cf6"];

  // Recent Activity (last 8)
  const recentActivity = [
    ...incomes.map(inc => ({
      ...inc,
      type: 'income',
      isIncome: true,
      amount: inc.amount,
      label: inc.description
    })),
    ...expenses.map(exp => ({
      ...exp,
      type: 'expense',
      isIncome: false,
      amount: exp.total_expense,
      label: exp.description
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

  const cardStyle = {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    border: "1px solid #f1f5f9",
  };

  const chartContainerStyle = {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
    border: "1px solid #f1f5f9",
  };

  return (
    <div style={{ padding: "20px" }}>
      <header style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
          Financial Overview
        </h1>
        <p style={{ color: "#64748b", marginTop: "4px" }}>Real-time view of your finances</p>
      </header>

      {/* SUMMARY CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        <div style={cardStyle}>
          <span style={{ color: "#64748b", fontSize: "14px", fontWeight: "600" }}>TOTAL BALANCE</span>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b", marginTop: "8px" }}>
            {totalBalance.toLocaleString()} <span style={{ fontSize: "18px", color: "#94a3b8" }}>ETB</span>
          </div>
        </div>

        <div style={{ ...cardStyle, borderLeft: "5px solid #10b981" }}>
          <span style={{ color: "#10b981", fontSize: "14px", fontWeight: "600" }}>TOTAL INCOME</span>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#065f46", marginTop: "8px" }}>
            {totalIncome.toLocaleString()} <span style={{ fontSize: "18px", color: "#94a3b8" }}>ETB</span>
          </div>
          <div style={{ fontSize: "13px", marginTop: "4px" }}>
            Cash: {cashIncome.toLocaleString()} | Bank: {bankIncome.toLocaleString()}
          </div>
        </div>

        <div style={{ ...cardStyle, borderLeft: "5px solid #ef4444" }}>
          <span style={{ color: "#ef4444", fontSize: "14px", fontWeight: "600" }}>TOTAL EXPENSES</span>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#991b1b", marginTop: "8px" }}>
            {totalExpenses.toLocaleString()} <span style={{ fontSize: "18px", color: "#94a3b8" }}>ETB</span>
          </div>
          <div style={{ fontSize: "13px", marginTop: "4px" }}>
            Cash: {cashExpense.toLocaleString()} | Bank: {bankExpense.toLocaleString()}
          </div>
        </div>

        <div style={{
          ...cardStyle,
          background: netProfit >= 0 ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #ef4444, #dc2626)",
          color: "#fff"
        }}>
          <span style={{ opacity: 0.9, fontSize: "14px", fontWeight: "600" }}>NET PROFIT / LOSS</span>
          <div style={{ fontSize: "32px", fontWeight: "800", marginTop: "8px" }}>
            {netProfit.toLocaleString()} <span style={{ fontSize: "18px", opacity: 0.8 }}>ETB</span>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <div style={{ ...chartContainerStyle, flex: "1 1 55%" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...chartContainerStyle, flex: "1 1 40%" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>Expenses by Payment Method</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div style={{ marginTop: "40px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Recent Activity</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {recentActivity.length > 0 ? (
            recentActivity.map((item, index) => (
              <div key={index} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                background: "#fff",
                borderRadius: "12px",
                border: "1px solid #f1f5f9"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    background: item.isIncome ? "#ecfdf5" : "#fef2f2",
                    color: item.isIncome ? "#10b981" : "#ef4444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px"
                  }}>
                    {item.isIncome ? "↓" : "↑"}
                  </div>
                  <div>
                    <div style={{ fontWeight: "600" }}>{item.label || item.description}</div>
                    <div style={{ fontSize: "13px", color: "#64748b" }}>
                      {item.date} • {item.payment_source?.toUpperCase() || item.account}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontWeight: "700",
                  color: item.isIncome ? "#10b981" : "#ef4444",
                  fontSize: "17px"
                }}>
                  {item.isIncome ? "+" : "-"}{Number(item.amount).toLocaleString()} ETB
                </div>
              </div>
            ))
          ) : (
            <p>No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;