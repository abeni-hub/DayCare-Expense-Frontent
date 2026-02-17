function IncomeList({ incomes }) {
  if (incomes.length === 0) {
    return <p>No income added yet.</p>;
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
      <h3 style={{ marginBottom: "15px" }}>Income History</h3>

      {incomes.map((income) => (
        <div
          key={income.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #eee",
            padding: "8px 0",
          }}
        >
          <div>
            <strong>{income.title}</strong>
            <div style={{ fontSize: "12px", color: "#555" }}>
              {income.account} • {income.date}
            </div>
          </div>

          <div style={{ color: "#16a34a", fontWeight: "bold" }}>
            + ETB {income.amount.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

export default IncomeList;
