import React, { useState, useEffect } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import { getExpenses, deleteExpense } from "../../apis/expenses.api";

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch data from Django on component mount
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (savedExpense) => {
    if (editingExpense) {
      // Update list with the edited object from server
      setExpenses(expenses.map(e => e.id === savedExpense.id ? savedExpense : e));
    } else {
      // Add new object to the top
      setExpenses([savedExpense, ...expenses]);
    }
    setEditingExpense(null);
    setIsAdding(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id);
        setExpenses(expenses.filter(e => e.id !== id));
      } catch (err) {
        alert("Delete failed. Please try again.");
      }
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading transaction data...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontWeight: 800 }}>Expenses</h2>
        <button
          onClick={() => setIsAdding(true)}
          style={{ background: '#2563eb', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
        >
          + Add Expense
        </button>
      </div>

      {(isAdding || editingExpense) && (
        <div style={{ marginBottom: '30px' }}>
          <ExpenseForm
            onSubmit={handleFormSubmit}
            editingExpense={editingExpense}
            clearEdit={() => {
              setEditingExpense(null);
              setIsAdding(false);
            }}
          />
        </div>
      )}

      <ExpenseList
        expenses={expenses}
        onDeleteExpense={handleDelete}
        onEditClick={(exp) => setEditingExpense(exp)}
      />
    </div>
  );
}

export default ExpensesPage;