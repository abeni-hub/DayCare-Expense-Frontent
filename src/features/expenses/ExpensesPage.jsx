import { useState } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";

function ExpensesPage({
  expenses,
  onAddExpense,
  onDeleteExpense,
  onEditExpense,
}) {
  const [editingExpense, setEditingExpense] = useState(null);

  const handleSubmit = (expense) => {
    if (editingExpense) {
      onEditExpense(expense);
      setEditingExpense(null);
    } else {
      onAddExpense(expense);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "25px" }}>Expenses</h1>

      <ExpenseForm
        onSubmit={handleSubmit}
        editingExpense={editingExpense}
        clearEdit={() => setEditingExpense(null)}
      />

      <ExpenseList
        expenses={expenses}
        onDeleteExpense={onDeleteExpense}
        onEditClick={setEditingExpense}
      />
    </div>
  );
}

export default ExpensesPage;
