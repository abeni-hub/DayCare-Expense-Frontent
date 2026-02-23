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

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Invoice Preview Modal
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [currentInvoiceUrl, setCurrentInvoiceUrl] = useState("");

  const buildQueryUrl = (baseUrl = null) => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (categoryFilter) params.append("category", categoryFilter);
    if (dateFrom) params.append("date__gte", dateFrom);
    if (dateTo) params.append("date__lte", dateTo);

    const queryString = params.toString();
    if (!baseUrl) return `/api/expenses/?${queryString}`;

    // For next/prev URLs, keep original params but override filters
    const url = new URL(baseUrl);
    if (queryString) url.search = `?${queryString}`;
    return url.toString();
  };

  const loadExpenses = async (url = null) => {
    try {
      setLoading(true);
      setError(null);
      const finalUrl = url || buildQueryUrl();
      const data = await getExpenses(finalUrl);

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

  // Load when filters change or page first loads
  useEffect(() => {
    loadExpenses();
  }, [searchTerm, categoryFilter, dateFrom, dateTo]);

  const handleFormSubmit = (savedData) => {
    loadExpenses();   // refresh current filtered page
    setEditingExpense(null);
    setIsAdding(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this expense?")) {
      try {
        await deleteExpense(id);
        loadExpenses();
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

  const handleViewInvoice = (invoiceUrl) => {
    if (invoiceUrl) {
      setCurrentInvoiceUrl(invoiceUrl);
      setShowInvoiceModal(true);
    } else {
      alert("No invoice uploaded for this expense.");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setDateFrom("");
    setDateTo("");
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

      {/* FILTERS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '12px', marginBottom: '25px', alignItems: 'end' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Search Description</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search..."
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Supplies">Supplies</option>
            <option value="Utilities">Utilities</option>
            <option value="Rent">Rent</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Date From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Date To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <button
          onClick={resetFilters}
          style={{ padding: '10px 18px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', height: '42px' }}
        >
          Reset Filters
        </button>
      </div>

      {error && <p style={{ color: "red", padding: "10px" }}>{error}</p>}

      <ExpenseList
        expenses={expenses}
        onDeleteExpense={handleDelete}
        onEditClick={(exp) => { setEditingExpense(exp); setIsAdding(true); }}
        onViewInvoice={handleViewInvoice}
      />

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px' }}>
        <button onClick={() => prevUrl && loadExpenses(prevUrl)} disabled={!prevUrl} style={paginationBtn(prevUrl)}>
          ← Previous Page
        </button>
        <button onClick={() => nextUrl && loadExpenses(nextUrl)} disabled={!nextUrl} style={paginationBtn(nextUrl)}>
          Next Page →
        </button>
      </div>

      {/* Form Modal */}
      {(isAdding || editingExpense) && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={modalHeader}>
              <h3>{editingExpense ? "Edit Expense" : "New Expense"}</h3>
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

      {/* Invoice Preview Modal */}
      {showInvoiceModal && (
        <div style={modalOverlay}>
          <div style={{ ...modalContent, maxWidth: '800px', textAlign: 'center' }}>
            <div style={modalHeader}>
              <h3>Invoice Preview</h3>
              <button onClick={() => setShowInvoiceModal(false)} style={closeModalBtn}>✕</button>
            </div>
            <div style={{ padding: '20px' }}>
              <img
                src={currentInvoiceUrl}
                alt="Invoice"
                style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=No+Preview+Available'; }}
              />
              <div style={{ marginTop: '20px' }}>
                <a href={currentInvoiceUrl} target="_blank" rel="noopener noreferrer" download>
                  <button style={{ padding: '12px 30px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    📥 Download Invoice
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const modalOverlay = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 };
const modalContent = { background: "#fff", borderRadius: "16px", width: "95%", maxWidth: "1050px", maxHeight: "95vh", overflow: "auto", boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.4)" };
const modalHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 30px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" };
const closeModalBtn = { background: "none", border: "none", fontSize: "28px", cursor: "pointer", color: "#64748b" };
const paginationBtn = (enabled) => ({
  padding: '10px 20px',
  background: enabled ? '#2563eb' : '#e2e8f0',
  color: enabled ? '#fff' : '#94a3b8',
  border: 'none',
  borderRadius: '8px',
  cursor: enabled ? 'pointer' : 'not-allowed',
  fontWeight: 600
});

export default ExpensesPage;