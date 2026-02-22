import React, { useState, useEffect } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import { getExpenses, deleteExpense } from "../../apis/expenses.api";

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load expenses when page loads OR when you come back from another page
  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getExpenses();
      console.log("✅ API Response (Expenses):", data);   // ← This will show your data
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Failed to load expenses. Please check server.");
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  // Run on first load + every time component mounts (after navigation back)
  useEffect(() => {
    loadExpenses();
  }, []);

  // After successful create or update → refresh the list from server
  const handleFormSubmit = (savedData) => {
    console.log("✅ Form submitted successfully:", savedData);
    loadExpenses();                    // ← THIS IS THE IMPORTANT FIX
    setEditingExpense(null);
    setIsAdding(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this expense?")) {
      try {
        await deleteExpense(id);
        loadExpenses();                // refresh list after delete
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  if (loading) return <div style={{ padding: '30px' }}>Loading expenses...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <h2 style={{ fontWeight: 800, margin: 0 }}>Expenses</h2>
        <button
          onClick={() => { setEditingExpense(null); setIsAdding(true); }}
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
            clearEdit={() => { setEditingExpense(null); setIsAdding(false); }}
          />
        </div>
      )}

      {error && <p style={{ color: "red", padding: "10px" }}>{error}</p>}

      <ExpenseList
        expenses={expenses}
        onDeleteExpense={handleDelete}
        onEditClick={(exp) => { setEditingExpense(exp); setIsAdding(false); }}
      />
    </div>
  );
}

export default ExpensesPage;