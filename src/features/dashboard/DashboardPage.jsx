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

  if (loading) return (
    <div style={{ display: "flex", height: "80vh", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
      <div className="animate-pulse text-lg font-medium">Loading Financial Intelligence...</div>
    </div>
  );

  // LOGIC (Untouched as requested)
  const realAccounts = accounts.filter(acc => acc.account_type !== "combined" && acc.id !== "combined");
  const totalBalance = realAccounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0);
  const totalIncome = incomes.reduce((sum, inc) => sum + Number(inc.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.total_expense || 0), 0);
  const netProfit = totalIncome - totalExpenses;

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

  const barData = [
    { name: "Income", amount: totalIncome, fill: "#10b981" },
    { name: "Expenses", amount: totalExpenses, fill: "#ef4444" },
  ];
  const pieData = [
    { name: "Cash", value: cashExpense },
    { name: "Bank", value: bankExpense },
  ];
  const COLORS = ["#6366f1", "#a855f7"];

  const recentActivity = [
    ...incomes.map(inc => ({ ...inc, isIncome: true, label: inc.description })),
    ...expenses.map(exp => ({ ...exp, isIncome: false, label: exp.description, amount: exp.total_expense }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

  // STYLE OBJECTS
  const styles = {
    container: { padding: "32px", maxWidth: "1400px", margin: "0 auto" },
    header: { marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" },
    card: {
      backgroundColor: "#ffffff",
      padding: "24px",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      minHeight: "140px"
    },
    profitCard: {
      background: netProfit >= 0 ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" : "linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)",
      color: "#fff",
      border: "none"
    },
    chartCard: {
      backgroundColor: "#fff",
      padding: "28px",
      borderRadius: "20px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.04)",
    },
    activityItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "16px",
      transition: "background 0.2s",
      borderBottom: "1px solid #f1f5f9",
      alignItems: "center"
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header style={styles.header}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>Dashboard</h1>
          <p style={{ color: "#64748b", fontWeight: "500" }}>Performance Overview • {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
        <div style={{ backgroundColor: "#fff", padding: "8px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", fontWeight: "600", color: "#475569" }}>
          Active Session: Admin
        </div>
      </header>

      {/* SUMMARY GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "40px" }}>

        {/* Total Balance */}
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#64748b", fontSize: "13px", fontWeight: "700", textTransform: "uppercase" }}>Vault Balance</span>
            <span style={{ fontSize: "20px" }}>🏛️</span>
          </div>
          <div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a" }}>{totalBalance.toLocaleString()} <span style={{ fontSize: "16px", color: "#94a3b8" }}>ETB</span></div>
            <div style={{ fontSize: "12px", color: "#10b981", marginTop: "4px", fontWeight: "600" }}>↑ Live Updated</div>
          </div>
        </div>

        {/* Total Income */}
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#10b981", fontSize: "13px", fontWeight: "700", textTransform: "uppercase" }}>Total Revenue</span>
            <span style={{ fontSize: "20px" }}>📈</span>
          </div>
          <div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#064e3b" }}>{totalIncome.toLocaleString()} <span style={{ fontSize: "16px", color: "#94a3b8" }}>ETB</span></div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
               C: <b style={{color: "#475569"}}>{cashIncome.toLocaleString()}</b> • B: <b style={{color: "#475569"}}>{bankIncome.toLocaleString()}</b>
            </div>
          </div>
        </div>

        {/* Total Expenses */}
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#ef4444", fontSize: "13px", fontWeight: "700", textTransform: "uppercase" }}>Expenditure</span>
            <span style={{ fontSize: "20px" }}>📉</span>
          </div>
          <div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#7f1d1d" }}>{totalExpenses.toLocaleString()} <span style={{ fontSize: "16px", color: "#94a3b8" }}>ETB</span></div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
              C: <b style={{color: "#475569"}}>{cashExpense.toLocaleString()}</b> • B: <b style={{color: "#475569"}}>{bankExpense.toLocaleString()}</b>
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div style={{ ...styles.card, ...styles.profitCard }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ opacity: 0.8, fontSize: "13px", fontWeight: "700", textTransform: "uppercase" }}>Net Position</span>
            <span style={{ fontSize: "20px" }}>💎</span>
          </div>
          <div>
            <div style={{ fontSize: "28px", fontWeight: "800" }}>{netProfit.toLocaleString()} <span style={{ fontSize: "16px", opacity: 0.7 }}>ETB</span></div>
            <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "4px" }}>{netProfit >= 0 ? "Profit Margin Positive" : "Deficit Warning"}</div>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "24px", marginBottom: "40px" }}>
        <div style={styles.chartCard}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "4px", height: "16px", backgroundColor: "#6366f1", borderRadius: "2px" }}></div>
            Revenue vs Expenses Flow
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="amount" radius={[6, 6, 6, 6]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartCard}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "24px" }}>Expense Channels</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={8}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ACTIVITY FEED */}
      <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ padding: "24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>Recent Transactions</h3>
          <button style={{ fontSize: "13px", fontWeight: "600", color: "#6366f1", background: "none", border: "none", cursor: "pointer" }}>View All</button>
        </div>
        <div>
          {recentActivity.length > 0 ? (
            recentActivity.map((item, index) => (
              <div key={index} style={styles.activityItem}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: item.isIncome ? "#f0fdf4" : "#fef2f2",
                    color: item.isIncome ? "#16a34a" : "#dc2626",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: "bold"
                  }}>
                    {item.isIncome ? "↙" : "↗"}
                  </div>
                  <div>
                    <div style={{ fontWeight: "700", color: "#1e293b", fontSize: "15px" }}>{item.label || item.description}</div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500", marginTop: "2px" }}>
                      {item.date} • <span style={{ color: "#6366f1" }}>{item.payment_source?.toUpperCase() || item.account}</span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{
                    fontWeight: "800",
                    color: item.isIncome ? "#16a34a" : "#dc2626",
                    fontSize: "16px"
                  }}>
                    {item.isIncome ? "+" : "-"}{Number(item.amount).toLocaleString()}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>ETB</div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>No transactions found</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;