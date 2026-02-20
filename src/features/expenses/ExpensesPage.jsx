import React, { useState, useEffect } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import { getExpenses, deleteExpense } from "../../apis/expenses.api";

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]); // Initialized as empty array
  const [editingExpense, setEditingExpense] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await getExpenses();
      // Double check that we are setting an array
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (savedExpense) => {
    if (editingExpense) {
      setExpenses(prev => prev.map(e => e.id === savedExpense.id ? savedExpense : e));
    } else {
      setExpenses(prev => [savedExpense, ...prev]);
    }
    setEditingExpense(null);
    setIsAdding(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteExpense(id);
        setExpenses(prev => prev.filter(e => e.id !== id));
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

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