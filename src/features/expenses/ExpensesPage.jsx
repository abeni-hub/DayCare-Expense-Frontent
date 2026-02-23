import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [currentInvoiceUrl, setCurrentInvoiceUrl] = useState("");

  // ----------------------------
  // SEARCH DEBOUNCE (500ms)
  // ----------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ----------------------------
  // LOAD EXPENSES
  // ----------------------------
  const loadExpenses = async (customUrl = null) => {
    try {
      setLoading(true);
      setError(null);

      const query = new URLSearchParams({
        search: debouncedSearch || "",
        category: categoryFilter || "",
        date__gte: dateFrom || "",
        date__lte: dateTo || "",
      }).toString();

      const baseUrl = `/api/expenses/?${query}`;
      const finalUrl = customUrl || baseUrl;

      const data = await getExpenses(finalUrl);

      if (Array.isArray(data)) {
        setExpenses(data);
        setNextUrl(null);
        setPrevUrl(null);
      } else {
        setExpenses(data.results || []);
        setNextUrl(data.next || null);
        setPrevUrl(data.previous || null);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load expenses.");
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [debouncedSearch, categoryFilter, dateFrom, dateTo]);

  // ----------------------------
  // FORM SUBMIT
  // ----------------------------
  const handleFormSubmit = () => {
    loadExpenses();
    setEditingExpense(null);
    setIsAdding(false);
  };

  // ----------------------------
  // DELETE
  // ----------------------------
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

  // ----------------------------
  // EXPORT
  // ----------------------------
  const exportToExcel = () => {
    if (!expenses.length) return;

    const data = expenses.map((exp) => ({
      Date: exp.date,
      Description: exp.description,
      Category: exp.category,
      Supplier: exp.supplier || "",
      Payment: exp.payment_source?.toUpperCase(),
      "Total (ETB)": Number(exp.total_expense),
      Invoice: exp.invoice ? "Yes" : "No",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");

    XLSX.writeFile(
      wb,
      `Expenses_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setDateFrom("");
    setDateTo("");
  };

  const grandTotal = expenses.reduce(
    (sum, exp) => sum + Number(exp.total_expense || 0),
    0
  );

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div style={{ padding: "30px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h2 style={{ fontWeight: 800, fontSize: "28px" }}>
          Expense Management
        </h2>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={exportToExcel}
            disabled={!expenses.length}
            style={{
              padding: "10px 18px",
              background: expenses.length ? "#10b981" : "#9ca3af",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: expenses.length ? "pointer" : "not-allowed",
              fontWeight: 600,
            }}
          >
            📊 Export Excel
          </button>

          <button
            onClick={() => {
              setEditingExpense(null);
              setIsAdding(true);
            }}
            style={{
              padding: "10px 18px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            + Add Expense
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div
        style={{
          background: "#f8fafc",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
        }}
      >
        <input
          type="text"
          placeholder="Search description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Supplies">Supplies</option>
          <option value="Utilities">Utilities</option>
          <option value="Rent">Rent</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          style={inputStyle}
        />

        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={resetFilters}
          style={{
            background: "#64748b",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reset Filters
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
      )}

      {/* LOADING */}
      {loading ? (
        <div style={{ padding: "30px", textAlign: "center" }}>
          Loading expenses...
        </div>
      ) : expenses.length === 0 ? (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            background: "#f1f5f9",
            borderRadius: "12px",
          }}
        >
          No expenses found.
        </div>
      ) : (
        <ExpenseList
          expenses={expenses}
          onDeleteExpense={handleDelete}
          onEditClick={(exp) => {
            setEditingExpense(exp);
            setIsAdding(true);
          }}
        />
      )}

      {/* GRAND TOTAL */}
      <h3 style={{ marginTop: "25px", fontWeight: 700 }}>
        Grand Total: {grandTotal.toLocaleString()} ETB
      </h3>

      {/* PAGINATION */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginTop: "25px",
        }}
      >
        <button
          onClick={() => prevUrl && loadExpenses(prevUrl)}
          disabled={!prevUrl}
          style={paginationStyle(prevUrl)}
        >
          ← Previous
        </button>

        <button
          onClick={() => nextUrl && loadExpenses(nextUrl)}
          disabled={!nextUrl}
          style={paginationStyle(nextUrl)}
        >
          Next →
        </button>
      </div>

      {/* MODAL */}
      {(isAdding || editingExpense) && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <ExpenseForm
              onSubmit={handleFormSubmit}
              editingExpense={editingExpense}
              clearEdit={() => {
                setEditingExpense(null);
                setIsAdding(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------
// STYLES
// ----------------------------
const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  outline: "none",
};

const paginationStyle = (enabled) => ({
  padding: "8px 16px",
  background: enabled ? "#2563eb" : "#cbd5e1",
  color: enabled ? "#fff" : "#64748b",
  border: "none",
  borderRadius: "8px",
  cursor: enabled ? "pointer" : "not-allowed",
});

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const modalContent = {
  background: "#fff",
  borderRadius: "16px",
  width: "95%",
  maxWidth: "1000px",
  maxHeight: "95vh",
  overflow: "auto",
  padding: "25px",
};

export default ExpensesPage;