import React, { useState, useEffect } from "react";

// ------------------------------------------------------------------
// 1. MAIN APP COMPONENT (Handles Filtering & State)
// ------------------------------------------------------------------
export default function ExpenseManager() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  // Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleAddExpense = (expense) => {
    if (editingExpense) {
      setExpenses(expenses.map(e => e.id === expense.id ? expense : e));
      setEditingExpense(null);
    } else {
      setExpenses([expense, ...expenses]);
    }
  };

  // --- FILTERING LOGIC ---
  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch = exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exp.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === "All" || exp.category === filterCategory;

    // Date Logic
    const expDate = new Date(exp.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const matchesDate = (!start || expDate >= start) && (!end || expDate <= end);

    return matchesSearch && matchesCat && matchesDate;
  });

  return (
    <div style={{ padding: "40px", backgroundColor: "#f1f5f9", minHeight: "100vh" }}>

      {/* FILTER SECTION */}
      <div style={filterCardStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "15px", alignItems: "end" }}>
          <FormField label="Search Description/Supplier">
            <input
              style={inputStyle}
              placeholder="🔍 Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </FormField>
          <FormField label="Category">
            <select style={inputStyle} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option>All</option>
              <option>Food</option>
              <option>Supplies</option>
              <option>Utilities</option>
            </select>
          </FormField>
          <FormField label="From Date">
            <input type="date" style={inputStyle} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </FormField>
          <FormField label="To Date">
            <input type="date" style={inputStyle} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </FormField>
        </div>
      </div>

      {/* FORM SECTION */}
      <ExpenseForm
        onSubmit={handleAddExpense}
        editingExpense={editingExpense}
        clearEdit={() => setEditingExpense(null)}
      />

      {/* LIST SECTION (Summary of filtered results) */}
      <div style={{ marginTop: "30px", maxWidth: 950, margin: "30px auto" }}>
         <h3 style={sectionLabel}>Transactions ({filteredExpenses.length})</h3>
         {filteredExpenses.length === 0 ? (
           <p style={{color: '#94a3b8'}}>No expenses found matching those filters.</p>
         ) : (
           <div style={listContainer}>
             {filteredExpenses.map(exp => (
               <div key={exp.id} style={listItemStyle}>
                 <div>
                   <div style={{fontWeight: 700}}>{exp.description}</div>
                   <div style={{fontSize: 12, color: '#64748b'}}>{exp.date} | {exp.category}</div>
                 </div>
                 <div style={{textAlign: 'right'}}>
                   <div style={{fontWeight: 800, color: '#2563eb'}}>{exp.total.toLocaleString()} ETB</div>
                   <button onClick={() => setEditingExpense(exp)} style={editBtnSmall}>Edit</button>
                 </div>
               </div>
             ))}
           </div>
         )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 2. YOUR UPDATED EXPENSE FORM COMPONENT
// ------------------------------------------------------------------
function ExpenseForm({ onSubmit, editingExpense, clearEdit }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [supplier, setSupplier] = useState("");
  const [paymentSource, setPaymentSource] = useState("Cash");
  const [cashAmount, setCashAmount] = useState(0);
  const [bankAmount, setBankAmount] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [invoiceFile, setInvoiceFile] = useState(null);

  const [items, setItems] = useState([
    { id: Date.now(), name: "", qty: 1, price: 0, vat: 0 }
  ]);

  useEffect(() => {
    if (editingExpense) {
      setDate(editingExpense.date || "");
      setDescription(editingExpense.description || "");
      setCategory(editingExpense.category || "Food");
      setSupplier(editingExpense.supplier || "");
      setItems(editingExpense.items || []);
      setPaymentSource(editingExpense.paymentSource || "Cash");
      setCashAmount(editingExpense.cashAmount || 0);
      setBankAmount(editingExpense.bankAmount || 0);
      setRemarks(editingExpense.remarks || "");
    }
  }, [editingExpense]);

  const subtotal = items.reduce((sum, item) => sum + Number(item.qty) * Number(item.price), 0);
  const totalVatAmount = items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.price) * (Number(item.vat) / 100)), 0);
  const totalExpense = subtotal + totalVatAmount;

  const handleItemChange = (id, field, value) => {
    setItems(items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => setItems([...items, { id: Date.now(), name: "", qty: 1, price: 0, vat: 0 }]);
  const removeItem = (id) => items.length > 1 && setItems(items.filter((item) => item.id !== id));

  const handleSubmit = (e) => {
    e.preventDefault();
    const expense = {
      id: editingExpense ? editingExpense.id : Date.now(),
      date, description, category, supplier, items, subtotal, totalVatAmount, total: totalExpense,
      paymentSource, cashAmount, bankAmount, remarks,
      invoiceName: invoiceFile ? invoiceFile.name : editingExpense?.invoiceName || null
    };
    onSubmit(expense);
    if(!editingExpense) {
       setDescription(""); setSupplier(""); setItems([{ id: Date.now(), name: "", qty: 1, price: 0, vat: 0 }]);
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>{editingExpense ? "Edit Expense" : "Add New Expense"}</h2>
          <button type="button" onClick={clearEdit} style={closeBtnStyle}>✕</button>
        </div>

        <div style={rowGrid}>
          <FormField label="Date *"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} required /></FormField>
          <FormField label="Description *"><input type="text" value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} required /></FormField>
        </div>

        <div style={rowGrid}>
          <FormField label="Category">
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
              <option>Food</option><option>Supplies</option><option>Utilities</option>
            </select>
          </FormField>
          <FormField label="Supplier"><input type="text" value={supplier} onChange={(e) => setSupplier(e.target.value)} style={inputStyle} /></FormField>
        </div>

        <div style={{ marginBottom: 30 }}>
          <div style={tableHeaderRow}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={sectionLabel}>Expense Items</span>
              <button type="button" onClick={addItem} style={addItemBtn}>+ Add Item</button>
            </div>
            <div style={tableGridHeader}>
              <span>Item Name</span><span>Qty</span><span>Price</span><span>VAT %</span><span style={{ textAlign: "right" }}>Total</span><span></span>
            </div>
          </div>
          {items.map((item) => (
            <div key={item.id} style={tableGridRow}>
              <input style={inputStyle} value={item.name} onChange={(e) => handleItemChange(item.id, "name", e.target.value)} required />
              <input type="number" style={inputStyle} value={item.qty} onChange={(e) => handleItemChange(item.id, "qty", e.target.value)} />
              <input type="number" style={inputStyle} value={item.price} onChange={(e) => handleItemChange(item.id, "price", e.target.value)} />
              <input type="number" style={inputStyle} value={item.vat} onChange={(e) => handleItemChange(item.id, "vat", e.target.value)} />
              <div style={totalCell}>{((item.qty * item.price) * (1 + Number(item.vat) / 100)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <button type="button" onClick={() => removeItem(item.id)} style={deleteBtn}>🗑</button>
            </div>
          ))}
        </div>

        <div style={summaryBox}>
          <div style={{ textAlign: "right", flex: 1 }}>
            <div style={calcLine}>Subtotal: <span>{subtotal.toLocaleString()} ETB</span></div>
            <div style={calcLine}>VAT: <span>{totalVatAmount.toLocaleString()} ETB</span></div>
            <div style={totalLine}>Grand Total: <span>{totalExpense.toLocaleString()} ETB</span></div>
          </div>
        </div>

        <FormField label="Payment Method">
          <div style={paymentRow}>
            {["Cash", "Bank", "Both"].map((s) => (
              <label key={s} style={radioCard(paymentSource === s)}>
                <input type="radio" value={s} checked={paymentSource === s} onChange={(e) => setPaymentSource(e.target.value)} hidden />
                {s}
              </label>
            ))}
          </div>
        </FormField>

        <div style={rowGrid}>
          <FormField label="Invoice"><input type="file" onChange={(e) => setInvoiceFile(e.target.files[0])} style={inputStyle} /></FormField>
          <FormField label="Remarks"><textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} style={{ ...inputStyle, height: 42 }} /></FormField>
        </div>

        <div style={{ display: "flex", gap: 15 }}>
          <button type="button" onClick={clearEdit} style={cancelBtn}>Cancel</button>
          <button type="submit" style={submitBtn}>Save Transaction</button>
        </div>
      </form>
    </div>
  );
}

// ------------------------------------------------------------------
// 3. SHARED UI COMPONENTS & STYLES
// ------------------------------------------------------------------
const FormField = ({ label, children }) => (
  <div style={{width: '100%'}}>
    <label style={labelStyle}>{label}</label>
    {children}
  </div>
);

const containerStyle = { background: "#fff", padding: 30, borderRadius: 12, border: "1px solid #e2e8f0", maxWidth: 950, margin: "auto" };
const filterCardStyle = { background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e2e8f0", maxWidth: 950, margin: "0 auto 20px auto" };
const inputStyle = { width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" };
const rowGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 25 };
const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", color: "#64748b" };
const tableGridHeader = { display: "grid", gridTemplateColumns: "3fr 1fr 1.5fr 1fr 1.5fr 40px", gap: 10, fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#94a3b8" };
const tableGridRow = { display: "grid", gridTemplateColumns: "3fr 1fr 1.5fr 1fr 1.5fr 40px", gap: 10, marginBottom: 10, alignItems: "center" };
const titleStyle = { margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" };
const headerStyle = { display: "flex", justifyContent: "space-between", marginBottom: 25 };
const closeBtnStyle = { background: "none", border: "none", fontSize: 20, cursor: "pointer" };
const addItemBtn = { background: "#2563eb", border: "none", color: "#fff", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontWeight: 700 };
const tableHeaderRow = { marginBottom: 15 };
const totalCell = { textAlign: "right", fontWeight: 700 };
const deleteBtn = { border: "none", background: "none", cursor: "pointer", color: "#ef4444" };
const sectionLabel = { fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#475569" };
const summaryBox = { background: "#f8fafc", padding: 20, borderRadius: 10, border: "1px solid #e2e8f0", marginBottom: 25 };
const calcLine = { fontSize: 14, display: "flex", justifyContent: "space-between", marginBottom: 5 };
const totalLine = { fontSize: 18, fontWeight: 800, color: "#2563eb", display: "flex", justifyContent: "space-between", marginTop: 10 };
const paymentRow = { display: "flex", gap: 10, marginBottom: 20 };
const radioCard = (active) => ({ flex: 1, padding: 12, textAlign: "center", borderRadius: 8, cursor: "pointer", fontWeight: 600, border: active ? "2px solid #2563eb" : "1px solid #e2e8f0", background: active ? "#eff6ff" : "#fff" });
const cancelBtn = { flex: 1, padding: 12, borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff", fontWeight: 600, cursor: "pointer" };
const submitBtn = { flex: 2, padding: 12, borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer" };
const listItemStyle = { display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#fff', borderBottom: '1px solid #e2e8f0', alignItems: 'center' };
const listContainer = { borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' };
const editBtnSmall = { background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '12px', fontWeight: '700' };