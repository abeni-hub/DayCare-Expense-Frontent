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
import { getAccounts } from "../../apis/accounts.api";

function DashboardPage() {
  const [accounts, setAccounts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const normalize = (data) => {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if (data.results) return data.results;
      return [];
    };

    const fetchData = async () => {
      try {
        const [accData, expData, incData] = await Promise.all([
          getAccounts(),
          getExpenses(),
          getIncomes(),
        ]);

        setAccounts(normalize(accData));
        setExpenses(normalize(expData));
        setIncomes(normalize(incData));

      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setAccounts([]);
        setExpenses([]);
        setIncomes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          height: "80vh",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748b",
        }}
      >
        <div className="animate-pulse text-lg font-medium">
          Loading Financial Intelligence...
        </div>
      </div>
    );

  // SAFETY: Ensure arrays
  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const safeIncomes = Array.isArray(incomes) ? incomes : [];

  // LOGIC
  const realAccounts = safeAccounts.filter(
    (acc) => acc.account_type !== "combined" && acc.id !== "combined"
  );

  const totalBalance = realAccounts.reduce(
    (sum, acc) => sum + Number(acc.balance || 0),
    0
  );

  const totalIncome = safeIncomes.reduce(
    (sum, inc) => sum + Number(inc.amount || 0),
    0
  );

  const totalExpenses = safeExpenses.reduce(
    (sum, exp) => sum + Number(exp.total_expense || 0),
    0
  );

  const netProfit = totalIncome - totalExpenses;

  const cashIncome = safeIncomes.reduce((sum, inc) => {
    if (inc.payment_source === "cash") return sum + Number(inc.amount || 0);
    if (inc.payment_source === "combined")
      return sum + Number(inc.amount_cash || 0);
    return sum;
  }, 0);

  const bankIncome = safeIncomes.reduce((sum, inc) => {
    if (inc.payment_source === "bank") return sum + Number(inc.amount || 0);
    if (inc.payment_source === "combined")
      return sum + Number(inc.amount_bank || 0);
    return sum;
  }, 0);

  const cashExpense = safeExpenses.reduce((sum, exp) => {
    if (exp.payment_source === "cash")
      return sum + Number(exp.total_expense || 0);
    if (exp.payment_source === "combined")
      return sum + Number(exp.amount_cash || 0);
    return sum;
  }, 0);

  const bankExpense = safeExpenses.reduce((sum, exp) => {
    if (exp.payment_source === "bank")
      return sum + Number(exp.total_expense || 0);
    if (exp.payment_source === "combined")
      return sum + Number(exp.amount_bank || 0);
    return sum;
  }, 0);

  const barData = [
    { name: "Income", amount: totalIncome },
    { name: "Expenses", amount: totalExpenses },
  ];

  const pieData = [
    { name: "Cash", value: cashExpense },
    { name: "Bank", value: bankExpense },
  ];

  const COLORS = ["#6366f1", "#a855f7"];

  const recentActivity = [
    ...safeIncomes.map((inc) => ({
      ...inc,
      isIncome: true,
      label: inc.description,
    })),
    ...safeExpenses.map((exp) => ({
      ...exp,
      isIncome: false,
      label: exp.description,
      amount: exp.total_expense,
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  return (
    <div style={{ padding: "32px", maxWidth: "1400px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "30px" }}>
        Dashboard
      </h1>

      {/* SUMMARY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <SummaryCard title="Vault Balance" value={totalBalance} icon="🏛️" />
        <SummaryCard title="Total Revenue" value={totalIncome} icon="📈" />
        <SummaryCard title="Total Expenses" value={totalExpenses} icon="📉" />
        <SummaryCard title="Net Position" value={netProfit} icon="💎" />
      </div>

      {/* CHARTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "24px",
          marginBottom: "40px",
        }}
      >
        <div style={{ background: "#fff", padding: "24px", borderRadius: "16px" }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#fff", padding: "24px", borderRadius: "16px" }}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90}>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "24px" }}>
        <h3 style={{ fontWeight: "700", marginBottom: "20px" }}>
          Recent Transactions
        </h3>

        {recentActivity.length > 0 ? (
          recentActivity.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <span>{item.label}</span>
              <span
                style={{
                  color: item.isIncome ? "#16a34a" : "#dc2626",
                  fontWeight: "700",
                }}
              >
                {item.isIncome ? "+" : "-"}
                {Number(item.amount).toLocaleString()} ETB
              </span>
            </div>
          ))
        ) : (
          <div>No transactions</div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "14px",
        border: "1px solid #e2e8f0",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#64748b", fontSize: "13px" }}>{title}</span>
        <span>{icon}</span>
      </div>
      <div style={{ fontSize: "26px", fontWeight: "800", marginTop: "10px" }}>
        {Number(value).toLocaleString()} ETB
      </div>
    </div>
  );
}

export default DashboardPage;