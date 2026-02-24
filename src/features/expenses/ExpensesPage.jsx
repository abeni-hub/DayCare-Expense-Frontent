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

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // 1. Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 2. Load Expenses
  const loadExpenses = async (url = null) => {
    try {
      setLoading(true);
      setError(null);

      // If no URL is provided (first load or filter change), build the query
      let finalUrl = url;
      if (!finalUrl) {
        const params = new URLSearchParams();
        if (debouncedSearch) params.append("search", debouncedSearch);
        if (categoryFilter) params.append("category", categoryFilter);
        if (dateFrom) params.append("date__gte", dateFrom);
        if (dateTo) params.append("date__lte", dateTo);
        finalUrl = `?${params.toString()}`;
      }

      const data = await getExpenses(finalUrl);

      if (data.results) {
        setExpenses(data.results);
        setNextUrl(data.next);
        setPrevUrl(data.previous);
      } else {
        setExpenses(data); // Handle non-paginated arrays
        setNextUrl(null);
        setPrevUrl(null);
      }
    } catch (err) {
      setError("Unable to sync with server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [debouncedSearch, categoryFilter, dateFrom, dateTo]);

  const handleFormSubmit = () => {
    loadExpenses();
    setEditingExpense(null);
    setIsAdding(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record? This action cannot be undone.")) {
      try {
        await deleteExpense(id);
        loadExpenses();
      } catch (err) {
        alert("Action failed. Try again later.");
      }
    }
  };

  const handleViewDetail = (expense) => {
    setSelectedExpense(expense);
    setShowDetailModal(true);
  };

  const exportToExcel = () => {
    if (!expenses.length) return;
    const data = expenses.map((exp) => ({
      Date: exp.date,
      Description: exp.description,
      Category: exp.category,
      Supplier: exp.supplier || "N/A",
      Payment: exp.payment_source?.toUpperCase(),
      "Total (ETB)": Number(exp.total_expense),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, `Expenses_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const grandTotal = expenses.reduce((sum, exp) => sum + Number(exp.total_expense || 0), 0);

  return (
    <div style={styles.pageWrapper}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Expense Management</h2>
          <p style={styles.subtitle}>Track and manage your daycare expenditures</p>
        </div>

        <div style={styles.buttonGroup}>
          <button onClick={exportToExcel} disabled={!expenses.length} style={styles.btnSecondary}>
            📥 Export Report
          </button>
          <button onClick={() => { setEditingExpense(null); setIsAdding(true); }} style={styles.btnPrimary}>
            + New Expense
          </button>
        </div>
      </div>

      {/* STATS STRIP */}
      <div style={styles.statsStrip}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Displaying {expenses.length} Records</span>
          <span style={styles.statValue}>{grandTotal.toLocaleString()} <small>ETB</small></span>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div style={styles.filterPanel}>
        <div style={styles.inputWrapper}>
          <span style={styles.inputIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchField}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={styles.selectField}
        >
          <option value="">All Categories</option>
          <option value="Food">Food & Kitchen</option>
          <option value="Supplies">School Supplies</option>
          <option value="Utilities">Utilities</option>
          <option value="Rent">Facility Rent</option>
          <option value="Other">Miscellaneous</option>
        </select>

        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={styles.selectField} />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={styles.selectField} />

        <button onClick={() => {setSearchTerm(""); setCategoryFilter(""); setDateFrom(""); setDateTo("");}} style={styles.btnReset}>
          Reset
        </button>
      </div>

      {/* CONTENT AREA */}
      <div style={styles.contentCard}>
        {loading ? (
          <div style={styles.loader}>Processing records...</div>
        ) : expenses.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{fontSize: '40px'}}>📁</div>
            <p>No transactions match your current filters.</p>
          </div>
        ) : (
          <ExpenseList
            expenses={expenses}
            onDeleteExpense={handleDelete}
            onEditClick={(exp) => { setEditingExpense(exp); setIsAdding(true); }}
            onViewDetail={handleViewDetail}
          />
        )}
      </div>

      {/* PAGINATION */}
      <div style={styles.paginationRow}>
        <button onClick={() => prevUrl && loadExpenses(prevUrl)} disabled={!prevUrl} style={styles.pageBtn(prevUrl)}>
          Previous
        </button>
        <button onClick={() => nextUrl && loadExpenses(nextUrl)} disabled={!nextUrl} style={styles.pageBtn(nextUrl)}>
          Next Page
        </button>
      </div>

      {/* ADD/EDIT MODAL */}
      {(isAdding || editingExpense) && (
        <div style={styles.overlay}>
          <div style={styles.formModal}>
            <ExpenseForm
              onSubmit={handleFormSubmit}
              editingExpense={editingExpense}
              clearEdit={() => { setEditingExpense(null); setIsAdding(false); }}
            />
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {showDetailModal && selectedExpense && (
        <div style={styles.overlay} onClick={() => setShowDetailModal(false)}>
          <div style={styles.detailModal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={{margin: 0, fontWeight: 700}}>Transaction Vouchers</h3>
              <button onClick={() => setShowDetailModal(false)} style={styles.closeBtn}>×</button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.detailGrid}>
                <DetailItem label="Transaction Date" value={selectedExpense.date} />
                <DetailItem label="Category" value={selectedExpense.category} />
                <DetailItem label="Payment Source" value={selectedExpense.payment_source?.toUpperCase()} />
                <DetailItem label="Total Amount" value={`${Number(selectedExpense.total_expense).toLocaleString()} ETB`} highlight />
              </div>

              <div style={{marginTop: '20px'}}>
                <DetailItem label="Description" value={selectedExpense.description} />
              </div>

              <h4 style={styles.sectionTitle}>Breakdown Items</h4>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th>Item Name</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>VAT</th>
                      <th style={{textAlign: 'right'}}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedExpense.items?.map((item, i) => (
                      <tr key={i} style={styles.tableRow}>
                        <td>{item.item_name}</td>
                        <td>{item.quantity} {item.unit}</td>
                        <td>{Number(item.unit_price).toLocaleString()}</td>
                        <td>{item.vat_rate}%</td>
                        <td style={{textAlign: 'right', fontWeight: 600}}>{Number(item.total).toLocaleString()} ETB</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedExpense.invoice && (
                <div style={{marginTop: '30px'}}>
                  <h4 style={styles.sectionTitle}>Invoice / Receipt Image</h4>
                  <img src={selectedExpense.invoice} alt="Receipt" style={styles.invoiceImg} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Component for Modal
const DetailItem = ({ label, value, highlight }) => (
  <div style={{marginBottom: '10px'}}>
    <div style={{fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase'}}>{label}</div>
    <div style={{fontSize: highlight ? '20px' : '15px', fontWeight: highlight ? 800 : 500, color: highlight ? '#2563eb' : '#1e293b'}}>{value || "-"}</div>
  </div>
);

// ----------------------------
// PROFESSIONAL STYLES
// ----------------------------
const styles = {
  pageWrapper: { padding: "40px", backgroundColor: "#f8fafc", minHeight: "100%" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "30px" },
  title: { margin: 0, fontWeight: 800, fontSize: "32px", color: "#0f172a", letterSpacing: "-0.5px" },
  subtitle: { margin: "4px 0 0 0", color: "#64748b", fontWeight: 500 },
  buttonGroup: { display: "flex", gap: "12px" },
  btnPrimary: { padding: "12px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 600, boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)" },
  btnSecondary: { padding: "12px 24px", background: "#fff", color: "#1e293b", border: "1px solid #e2e8f0", borderRadius: "10px", cursor: "pointer", fontWeight: 600 },
  statsStrip: { marginBottom: "25px" },
  statCard: { display: "inline-flex", flexDirection: "column", background: "#fff", padding: "16px 24px", borderRadius: "14px", border: "1px solid #e2e8f0" },
  statLabel: { fontSize: "12px", color: "#64748b", fontWeight: 700, textTransform: "uppercase" },
  statValue: { fontSize: "24px", fontWeight: 800, color: "#0f172a" },
  filterPanel: { background: "#fff", padding: "20px", borderRadius: "16px", marginBottom: "25px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 100px", gap: "15px", border: "1px solid #e2e8f0", alignItems: "center" },
  inputWrapper: { position: "relative" },
  inputIcon: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", opacity: 0.5 },
  searchField: { width: "100%", padding: "12px 12px 12px 40px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px", boxSizing: "border-box" },
  selectField: { padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px", backgroundColor: "#fff" },
  btnReset: { background: "none", border: "none", color: "#ef4444", fontWeight: 700, cursor: "pointer", fontSize: "14px" },
  contentCard: { background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", minHeight: "400px", overflow: "hidden" },
  loader: { padding: "100px", textAlign: "center", color: "#64748b", fontWeight: 500 },
  emptyState: { padding: "100px", textAlign: "center", color: "#94a3b8", fontWeight: 500 },
  paginationRow: { display: "flex", justifyContent: "center", gap: "12px", marginTop: "30px" },
  pageBtn: (enabled) => ({ padding: "10px 20px", background: enabled ? "#0f172a" : "#f1f5f9", color: enabled ? "#fff" : "#cbd5e1", border: "none", borderRadius: "8px", cursor: enabled ? "pointer" : "not-allowed", fontWeight: 600 }),
  overlay: { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" },
  formModal: { background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "800px", maxHeight: "90vh", overflow: "auto", padding: "30px" },
  detailModal: { background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "900px", maxHeight: "90vh", overflow: "auto", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" },
  modalHeader: { padding: "20px 30px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#fff", zIndex: 10 },
  modalBody: { padding: "30px" },
  closeBtn: { background: "#f1f5f9", border: "none", width: "36px", height: "36px", borderRadius: "50%", fontSize: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  detailGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" },
  sectionTitle: { fontSize: "14px", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginTop: "40px", marginBottom: "15px", borderBottom: "2px solid #f1f5f9", paddingBottom: "8px" },
  tableWrapper: { borderRadius: "12px", border: "1px solid #f1f5f9", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
  tableHeader: { background: "#f8fafc", textAlign: "left", color: "#64748b" },
  tableRow: { borderBottom: "1px solid #f1f5f9" },
  invoiceImg: { maxWidth: "100%", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }
};

export default ExpensesPage;