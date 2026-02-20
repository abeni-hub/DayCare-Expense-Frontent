import React, { useState, useEffect } from "react";
import { createExpense, updateExpense } from "../../apis/expense.api"; // Ensure these exist

function ExpenseForm({ onSubmit, editingExpense, clearEdit }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [supplier, setSupplier] = useState("");
  const [paymentSource, setPaymentSource] = useState("cash"); // Match Django lowercase choices
  const [remarks, setRemarks] = useState("");
  const [items, setItems] = useState([
    { id: Date.now(), item_name: "", quantity: 1, unit_price: 0, unit: "pcs" }
  ]);

  useEffect(() => {
    if (editingExpense) {
      setDate(editingExpense.date || "");
      setDescription(editingExpense.description || "");
      setCategory(editingExpense.category || "Food");
      setSupplier(editingExpense.supplier || "");
      // Map backend fields back to frontend state if names differ
      setItems(editingExpense.items?.map(item => ({
        ...item,
        qty: item.quantity,
        price: item.unit_price
      })) || []);
      setPaymentSource(editingExpense.payment_source || "cash");
      setRemarks(editingExpense.remarks || "");
    }
  }, [editingExpense]);

  // UI Calculations (Visual only)
  const subtotal = items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unit_price || 0), 0);
  const totalExpense = subtotal; // Simplified as per your current DRF logic which calculates VAT on save

  const handleItemChange = (id, field, value) => {
    setItems(items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => setItems([...items, { id: Date.now(), item_name: "", quantity: 1, unit_price: 0, unit: "pcs" }]);
  const removeItem = (id) => items.length > 1 && setItems(items.filter((item) => item.id !== id));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // FORMAT FOR DJANGO BACKEND
    const payload = {
      date,
      description,
      category,
      supplier,
      payment_source: paymentSource.toLowerCase(),
      remarks,
      items: items.map(item => ({
        item_name: item.item_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        unit: item.unit || "pcs"
      })),
      vat_enabled: false, // Set based on your needs
      vat_rate: 0
    };

    try {
      let savedData;
      if (editingExpense) {
        savedData = await updateExpense(editingExpense.id, payload);
      } else {
        savedData = await createExpense(payload);
      }
      onSubmit(savedData); // Pass the response back to parent
    } catch (error) {
      alert(error.response?.data?.detail || "Error saving transaction");
    }
  };

  // --- REST OF YOUR UI (STAYED EXACTLY THE SAME) ---
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
              <span>Item Name</span><span>Qty</span><span>Price</span><span style={{ textAlign: "right" }}>Total</span><span></span>
            </div>
          </div>
          {items.map((item) => (
            <div key={item.id} style={tableGridRow}>
              <input style={inputStyle} placeholder="Item Name" value={item.item_name} onChange={(e) => handleItemChange(item.id, "item_name", e.target.value)} required />
              <input type="number" style={inputStyle} value={item.quantity} onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)} />
              <input type="number" style={inputStyle} value={item.unit_price} onChange={(e) => handleItemChange(item.id, "unit_price", e.target.value)} />
              <div style={totalCell}>{(item.quantity * item.unit_price).toLocaleString()}</div>
              <button type="button" onClick={() => removeItem(item.id)} style={deleteBtn}>🗑</button>
            </div>
          ))}
        </div>

        <div style={summaryBox}>
          <div style={{ textAlign: "right", flex: 1 }}>
            <div style={totalLine}>Grand Total: <span>{subtotal.toLocaleString()} ETB</span></div>
          </div>
        </div>

        <FormField label="Payment Method">
          <div style={paymentRow}>
            {["Cash", "Bank"].map((s) => (
              <label key={s} style={radioCard(paymentSource.toLowerCase() === s.toLowerCase())}>
                <input type="radio" value={s.toLowerCase()} checked={paymentSource.toLowerCase() === s.toLowerCase()} onChange={(e) => setPaymentSource(e.target.value)} hidden />
                {s}
              </label>
            ))}
          </div>
        </FormField>

        <div style={rowGrid}>
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

// ... (Constants for styles remain exactly as you provided)
const FormField = ({ label, children }) => (
  <div style={{width: '100%'}}>
    <label style={labelStyle}>{label}</label>
    {children}
  </div>
);

const containerStyle = { background: "#fff", padding: 30, borderRadius: 12, border: "1px solid #e2e8f0", maxWidth: 950, margin: "auto" };
const inputStyle = { width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" };
const rowGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 25 };
const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", color: "#64748b" };
const tableGridHeader = { display: "grid", gridTemplateColumns: "3fr 1fr 1.5fr 1.5fr 40px", gap: 10, fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#94a3b8" };
const tableGridRow = { display: "grid", gridTemplateColumns: "3fr 1fr 1.5fr 1.5fr 40px", gap: 10, marginBottom: 10, alignItems: "center" };
const titleStyle = { margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" };
const headerStyle = { display: "flex", justifyContent: "space-between", marginBottom: 25 };
const closeBtnStyle = { background: "none", border: "none", fontSize: 20, cursor: "pointer" };
const addItemBtn = { background: "#2563eb", border: "none", color: "#fff", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontWeight: 700 };
const tableHeaderRow = { marginBottom: 15 };
const totalCell = { textAlign: "right", fontWeight: 700 };
const deleteBtn = { border: "none", background: "none", cursor: "pointer", color: "#ef4444" };
const sectionLabel = { fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#475569" };
const summaryBox = { background: "#f8fafc", padding: 20, borderRadius: 10, border: "1px solid #e2e8f0", marginBottom: 25 };
const totalLine = { fontSize: 18, fontWeight: 800, color: "#2563eb", display: "flex", justifyContent: "space-between", marginTop: 10 };
const paymentRow = { display: "flex", gap: 10, marginBottom: 20 };
const radioCard = (active) => ({ flex: 1, padding: 12, textAlign: "center", borderRadius: 8, cursor: "pointer", fontWeight: 600, border: active ? "2px solid #2563eb" : "1px solid #e2e8f0", background: active ? "#eff6ff" : "#fff" });
const cancelBtn = { flex: 1, padding: 12, borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff", fontWeight: 600, cursor: "pointer" };
const submitBtn = { flex: 2, padding: 12, borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer" };

export default ExpenseForm;