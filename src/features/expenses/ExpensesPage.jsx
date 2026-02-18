import { useState } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";

function ExpensesPage({ expenses, onAddExpense, onDeleteExpense, onEditExpense }) {
  const [editingExpense, setEditingExpense] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (expense) => {
    if (editingExpense) {
      onEditExpense(expense);
    } else {
      onAddExpense(expense);
    }
    setEditingExpense(null);
    setIsAdding(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Expenses</h2>
        <button
            onClick={() => setIsAdding(true)}
            style={{ background: '#007bff', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          + Add Expense
        </button>
      </div>

      {(isAdding || editingExpense) && (
        <ExpenseForm
          onSubmit={handleSubmit}
          editingExpense={editingExpense}
          clearEdit={() => {
            setEditingExpense(null);
            setIsAdding(false);
          }}
        />
      )}

      <ExpenseList
        expenses={expenses}
        onDeleteExpense={onDeleteExpense}
        onEditClick={(exp) => setEditingExpense(exp)}
      />
    </div>
  );
}

export default ExpensesPage;