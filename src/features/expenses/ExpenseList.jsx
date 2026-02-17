function ExpenseList({ expenses }) {
  if (expenses.length === 0) {
    return <p>No expenses added yet.</p>;
  }

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>Expense History</h3>

      {expenses.map((expense) => (
        <div
          key={expense.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #eee",
            padding: "8px 0",
          }}
        >
          <div>
            <strong>{expense.title}</strong>
            <div style={{ fontSize: "12px", color: "#555" }}>
              {expense.account} • {expense.date}
            </div>
          </div>

          <div style={{ color: "#dc2626", fontWeight: "bold" }}>
            - ETB {expense.amount.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;
