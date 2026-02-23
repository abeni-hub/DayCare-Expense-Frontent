import React, { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import { getExpenses, deleteExpense } from "../../apis/expenses.api";

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [currentInvoiceUrl, setCurrentInvoiceUrl] = useState("");

  // ✅ Cleaner URL builder (no empty params)
  const buildFilterUrl = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (categoryFilter) params.append("category", categoryFilter);
    if (dateFrom) params.append("date__gte", dateFrom);
    if (dateTo) params.append("date__lte", dateTo);

    return `/api/expenses/?${params.toString()}`;
  };

  const loadExpenses = async (url = null) => {
    try {
      setLoading(true);
      setError(null);

      const finalUrl = url || buildFilterUrl();
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

  useEffect(() => {
    loadExpenses();
  }, [searchTerm, categoryFilter, dateFrom, dateTo]);

  const handleFormSubmit = (savedData) => {
    loadExpenses();           // refresh list
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

  const grandTotal = expenses.reduce((sum, exp) => sum + Number(exp.total_expense || 0), 0);

  const exportToExcel = () => {
    if (expenses.length === 0) return alert("No expenses to export!");
    const data = expenses.map(exp => ({
      Date: exp.date,
      Description: exp.description,
      Category: exp.category,
      Supplier: exp.supplier || "",
      Payment: exp.payment_source.toUpperCase(),
      "Total (ETB)": Number(exp.total_expense),
      Invoice: exp.invoice || "No Invoice"
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, `Expenses_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const handleViewInvoice = (invoiceUrl) => {
    if (invoiceUrl) {
      setCurrentInvoiceUrl(invoiceUrl);
      setShowInvoiceModal(true);
    } else alert("No invoice uploaded.");
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
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={exportToExcel} style={exportBtn}>📊 Export to Excel</button>
          <button
            onClick={() => { setEditingExpense(null); setIsAdding(true); }}
            style={addBtn}
          >
            + Add Expense
          </button>
        </div>
      </div>

      {/* Grand Total */}
      <div style={{
        background: '#f0fdf4',
        padding: '12px 20px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontWeight: 700,
        color: '#15803d',
        fontSize: '18px'
      }}>
        Grand Total: ETB {grandTotal.toLocaleString()}
      </div>

      {/* Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div>
          <label style={labelStyle}>Search Description</label>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Type description..."
            style={filterInput}
          />
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={filterInput}>
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Supplies">Supplies</option>
            <option value="Utilities">Utilities</option>
            <option value="Rent">Rent</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Date From</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={filterInput} />
        </div>
        <div>
          <label style={labelStyle}>Date To</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={filterInput} />
        </div>
        <button onClick={resetFilters} style={resetBtn}>Reset Filters</button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <ExpenseList
        expenses={expenses}
        onDeleteExpense={handleDelete}
        onEditClick={(exp) => { setEditingExpense(exp); setIsAdding(true); }}
        onViewInvoice={handleViewInvoice}
      />

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px' }}>
        <button
          onClick={() => prevUrl && loadExpenses(prevUrl)}
          disabled={!prevUrl}
          style={paginationBtn(prevUrl)}
        >
          ← Previous
        </button>
        <button
          onClick={() => nextUrl && loadExpenses(nextUrl)}
          disabled={!nextUrl}
          style={paginationBtn(nextUrl)}
        >
          Next →
        </button>
      </div>

      {/* Add/Edit Modal */}
      {(isAdding || editingExpense) && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={modalHeader}>
              <h3>{editingExpense ? "Edit Expense" : "New Expense"}</h3>
              <button
                onClick={() => { setEditingExpense(null); setIsAdding(false); }}
                style={closeModalBtn}
              >
                ✕
              </button>
            </div>
            <ExpenseForm
              onSubmit={handleFormSubmit}
              editingExpense={editingExpense}
              clearEdit={() => { setEditingExpense(null); setIsAdding(false); }}
            />
          </div>
        </div>
      )}

      {/* Invoice Modal (was missing in your code!) */}
      {showInvoiceModal && (
        <div style={modalOverlay}>
          <div style={{ ...modalContent, maxWidth: '900px' }}>
            <div style={modalHeader}>
              <h3>Invoice Preview</h3>
              <button onClick={() => setShowInvoiceModal(false)} style={closeModalBtn}>✕</button>
            </div>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              {currentInvoiceUrl ? (
                <img
                  src={currentInvoiceUrl}
                  alt="Invoice"
                  style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }}
                />
              ) : (
                <p>No invoice available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles (unchanged except label)
const labelStyle = { fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' };
const filterInput = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' };
const resetBtn = { padding: '10px 18px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', height: '42px' };
const exportBtn = { padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 };
const addBtn = { padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 };
const paginationBtn = (enabled) => ({
  padding: '10px 20px',
  background: enabled ? '#2563eb' : '#e2e8f0',
  color: enabled ? '#fff' : '#94a3b8',
  border: 'none',
  borderRadius: '8px',
  cursor: enabled ? 'pointer' : 'not-allowed',
  fontWeight: 600
});
const modalOverlay = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 };
const modalContent = { background: "#fff", borderRadius: "16px", width: "95%", maxWidth: "1050px", maxHeight: "95vh", overflow: "auto", boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.4)" };
const modalHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 30px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" };
const closeModalBtn = { background: "none", border: "none", fontSize: "28px", cursor: "pointer", color: "#64748b" };

export default ExpensesPage;