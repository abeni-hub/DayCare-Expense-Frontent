function IncomeList({
  incomes,
  onDeleteIncome,
  onEditIncome,
}) {
  if (incomes.length === 0) {
    return <p>No income added yet.</p>;
  }

  return (
    <div style={{ background: "#fff", padding: 20 }}>
      <h3>Income History</h3>

      {incomes.map((income) => (
        <div
          key={income.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <div>
            <strong>{income.title}</strong>
            <div>
              {income.account} • {income.date}
            </div>
          </div>

          <div>
            <strong>+ ETB {income.amount}</strong>

            <button
              onClick={() =>
                onEditIncome({
                  ...income,
                  amount: income.amount + 100,
                })
              }
              style={{ marginLeft: 10 }}
            >
              Edit
            </button>

            <button
              onClick={() =>
                onDeleteIncome(income.id)
              }
              style={{ marginLeft: 10 }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default IncomeList;
