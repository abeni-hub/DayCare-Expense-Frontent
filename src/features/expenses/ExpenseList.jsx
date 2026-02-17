function ExpenseList({
  expenses,
  onDeleteExpense,
  onEditClick,
}) {
  if (expenses.length === 0) {
    return <p>No expenses added yet.</p>;
  }

  return (
    <div style={{ background: "#fff", padding: 20 }}>
      <h3>Expense History</h3>

      {expenses.map((expense) => (
        <div
          key={expense.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <div>
            <strong>{expense.title}</strong>
            <div>
              {expense.account} • {expense.date}
            </div>
          </div>

          <div>
            <strong>- ETB {expense.amount}</strong>

            <button
              onClick={() => onEditClick(expense)}
              style={{ marginLeft: 10 }}
            >
              Edit
            </button>

            <button
              onClick={() =>
                onDeleteExpense(expense.id)
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

export default ExpenseList;
