import React, { useState, useEffect } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import { getExpenses, deleteExpense } from "../../api/expenses.api";

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      console.error("Load failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (data) => {
    if (editingExpense) {
      setExpenses(expenses.map(e => e.id === data.id ? data : e));
    } else {
      setExpenses([data, ...expenses]);
    }
    setIsAdding(false);
    setEditingExpense(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this transaction?")) {
      try {
        await deleteExpense(id);
        setExpenses(expenses.filter(e => e.id !== id));
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{fontWeight: 800}}>Expenses</h2>
        <button onClick={() => setIsAdding(true)} style={{ background: '#2563eb', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>
          + Add Expense
        </button>
      </div>

      {(isAdding || editingExpense) && (
        <ExpenseForm
          onSubmit={handleFormSubmit}
          editingExpense={editingExpense}
          clearEdit={() => { setIsAdding(false); setEditingExpense(null); }}
        />
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