function ExpenseList({ expenses, onDeleteExpense, onEditClick }) {
  if (!expenses.length) return <p>No expenses found.</p>;

  return (
    <div>
      {expenses.map(exp => (
        <div key={exp.id}>
          <strong>{exp.description}</strong>
          <p>{exp.total_expense} ETB</p>
          <p>{exp.payment_source_display}</p>
          <button onClick={() => onEditClick(exp)}>Edit</button>
          <button onClick={() => onDeleteExpense(exp.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;