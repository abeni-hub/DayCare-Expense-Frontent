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
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [currentInvoiceUrl, setCurrentInvoiceUrl] = useState("");

  // ----------------------------
  // LOAD EXPENSES
  // ----------------------------
  const loadExpenses = async (customUrl = null) => {
    try {
      setLoading(true);
      setError(null);

      const baseUrl = `/api/expenses/?search=${searchTerm}&category=${categoryFilter}&date__gte=${dateFrom}&date__lte=${dateTo}`;
      const finalUrl = customUrl || baseUrl;

      const data = await getExpenses(finalUrl);

      console.log("API RESPONSE:", data);

      // Handle paginated OR non-paginated response
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
      console.error("Fetch error:", err);
      setError("Failed to load expenses.");
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [searchTerm, categoryFilter, dateFrom, dateTo]);

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
    if (expenses.length === 0) {
      alert("No expenses to export!");
      return;
    }

    const data = expenses.map((exp) => ({
      Date: exp.date,
      Description: exp.description,
      Category: exp.category,
      Supplier: exp.supplier || "",
      Payment: exp.payment_source?.toUpperCase(),
      "Total (ETB)": Number(exp.total_expense),
      Invoice: exp.invoice || "No Invoice",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(
      wb,
      `Expenses_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const handleViewInvoice = (invoiceUrl) => {
    if (invoiceUrl) {
      setCurrentInvoiceUrl(invoiceUrl);
      setShowInvoiceModal(true);
    } else {
      alert("No invoice uploaded.");
    }
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
  if (loading) {
    return <div style={{ padding: "30px" }}>Loading expenses...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2 style={{ fontWeight: 800 }}>Expenses</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={exportToExcel}
            style={{
              padding: "10px 20px",
              background: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            📊 Export
          </button>

          <button
            onClick={() => {
              setEditingExpense(null);
              setIsAdding(true);
            }}
            style={{
              padding: "10px 20px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            + Add Expense
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "25px" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
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
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
        />

        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
        />

        <button
          onClick={resetFilters}
          style={{
            background: "#64748b",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Reset
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
      )}

      <ExpenseList
        expenses={expenses}
        onDeleteExpense={handleDelete}
        onEditClick={(exp) => {
          setEditingExpense(exp);
          setIsAdding(true);
        }}
        onViewInvoice={handleViewInvoice}
      />

      <h3 style={{ marginTop: "20px" }}>
        Grand Total: {grandTotal.toLocaleString()} ETB
      </h3>

      {/* PAGINATION */}
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "20px" }}>
        <button
          onClick={() => prevUrl && loadExpenses(prevUrl)}
          disabled={!prevUrl}
        >
          ← Previous
        </button>
        <button
          onClick={() => nextUrl && loadExpenses(nextUrl)}
          disabled={!nextUrl}
        >
          Next →
        </button>
      </div>

      {/* MODAL */}
      {(isAdding || editingExpense) && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "95%",
              maxWidth: "1000px",
              maxHeight: "95vh",
              overflow: "auto",
              padding: "20px",
            }}
          >
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

export default ExpensesPage;