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
} from "recharts";

function DashboardPage({ accounts, expenses, incomes }) {
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + acc.balance,
    0
  );

  const totalIncome = incomes.reduce(
    (sum, income) => sum + income.amount,
    0
  );

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const netProfit = totalIncome - totalExpenses;

  // ---------------- CHART DATA ----------------

  const barData = [
    { name: "Income", amount: totalIncome },
    { name: "Expenses", amount: totalExpenses },
  ];

  // Expenses grouped by account
  const expenseByAccount = accounts.map((account) => {
    const total = expenses
      .filter((exp) => exp.account === account.name)
      .reduce((sum, exp) => sum + exp.amount, 0);

    return {
      name: account.name,
      value: total,
    };
  });

  const COLORS = ["#16a34a", "#dc2626", "#2563eb", "#f59e0b"];

  const cardStyle = {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "10px",
    width: "250px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  };

  return (
    <div>
      <h1 style={{ marginBottom: "30px" }}>Dashboard</h1>

      {/* SUMMARY CARDS */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "40px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Balance</h3>
          <p style={{ fontSize: "22px", fontWeight: "bold" }}>
            ETB {totalBalance.toLocaleString()}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Total Income</h3>
          <p
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              color: "#16a34a",
            }}
          >
            ETB {totalIncome.toLocaleString()}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Total Expenses</h3>
          <p
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              color: "#dc2626",
            }}
          >
            ETB {totalExpenses.toLocaleString()}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Net Profit</h3>
          <p
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              color: netProfit >= 0 ? "#16a34a" : "#dc2626",
            }}
          >
            ETB {netProfit.toLocaleString()}
          </p>
        </div>
      </div>

      {/* CHART SECTION */}
      <div
        style={{
          display: "flex",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        {/* BAR CHART */}
        <div
          style={{
            width: "400px",
            height: "300px",
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h3>Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div
          style={{
            width: "400px",
            height: "300px",
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h3>Expenses by Account</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={expenseByAccount}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {expenseByAccount.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
