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

  // Pagination
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);

  const loadExpenses = async (url = null) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getExpenses(url);   // ← works with base URL or next/prev URL

      console.log("✅ API Response (Expenses):", data);

      setExpenses(data.results || []);
      setNextUrl(data.next);
      setPrevUrl(data.previous);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Failed to load expenses.");
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load + every time we come back to this page
  useEffect(() => {
    loadExpenses();   // first page
  }, []);

  const handleFormSubmit = (savedData) => {
    console.log("✅ Form submitted successfully:", savedData);
    loadExpenses();   // reload first page after create/update
    setEditingExpense(null);
    setIsAdding(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this expense?")) {
      try {
        await deleteExpense(id);
        loadExpenses();   // refresh after delete
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const openNewForm = () => {
    setEditingExpense(null);
    setIsAdding(true);
  };

  const closeForm = () => {
    setEditingExpense(null);
    setIsAdding(false);
  };

  if (loading) return <div style={{ padding: '30px' }}>Loading expenses...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <h2 style={{ fontWeight: 800, margin: 0 }}>Expenses</h2>
        <button
          onClick={openNewForm}
          style={{ background: '#2563eb', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
        >
          + Add Expense
        </button>
      </div>

      {error && <p style={{ color: "red", padding: "10px" }}>{error}</p>}

      <ExpenseList
        expenses={expenses}
        onDeleteExpense={handleDelete}
        onEditClick={(exp) => { setEditingExpense(exp); setIsAdding(true); }}
      />

      {/* Pagination Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px' }}>
        <button
          onClick={() => prevUrl && loadExpenses(prevUrl)}
          disabled={!prevUrl}
          style={{
            padding: '10px 20px',
            background: prevUrl ? '#2563eb' : '#e2e8f0',
            color: prevUrl ? '#fff' : '#94a3b8',
            border: 'none',
            borderRadius: '8px',
            cursor: prevUrl ? 'pointer' : 'not-allowed',
            fontWeight: 600
          }}
        >
          ← Previous Page
        </button>

        <button
          onClick={() => nextUrl && loadExpenses(nextUrl)}
          disabled={!nextUrl}
          style={{
            padding: '10px 20px',
            background: nextUrl ? '#2563eb' : '#e2e8f0',
            color: nextUrl ? '#fff' : '#94a3b8',
            border: 'none',
            borderRadius: '8px',
            cursor: nextUrl ? 'pointer' : 'not-allowed',
            fontWeight: 600
          }}
        >
          Next Page →
        </button>
      </div>

      {/* NICE MODAL */}
      {(isAdding || editingExpense) && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={modalHeader}>
              <h3 style={{ margin: 0 }}>
                {editingExpense ? "Edit Expense" : "New Expense"}
              </h3>
              <button onClick={closeForm} style={closeModalBtn}>✕</button>
            </div>

            <ExpenseForm
              onSubmit={handleFormSubmit}
              editingExpense={editingExpense}
              clearEdit={closeForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Modal Styles
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.75)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999
};

const modalContent = {
  background: "#fff",
  borderRadius: "16px",
  width: "95%",
  maxWidth: "1050px",
  maxHeight: "95vh",
  overflow: "auto",
  boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.4)"
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 30px",
  borderBottom: "1px solid #e2e8f0",
  background: "#f8fafc"
};

const closeModalBtn = {
  background: "none",
  border: "none",
  fontSize: "28px",
  cursor: "pointer",
  color: "#64748b",
  padding: "0 10px"
};

export default ExpensesPage;