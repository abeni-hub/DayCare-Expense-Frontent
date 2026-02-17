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

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
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
    </div>
  );
}

export default DashboardPage;
