import React, { useState, useEffect } from "react";
import { createExpense, updateExpense } from "../../apis/expenses.api";

export default function ExpenseForm({ onSubmit, editingExpense, clearEdit }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [supplier, setSupplier] = useState("");
  const [paymentSource, setPaymentSource] = useState("cash");
  const [remarks, setRemarks] = useState("");

  // FIX: Added 'unit' to the initial state
  const [items, setItems] = useState([
    { id: Date.now(), item_name: "", quantity: 1, unit_price: 0, unit: "pcs" }
  ]);

  useEffect(() => {
    if (editingExpense) {
      setDate(editingExpense.date || "");
      setDescription(editingExpense.description || "");
      setCategory(editingExpense.category || "Food");
      setSupplier(editingExpense.supplier || "");
      setPaymentSource(editingExpense.payment_source || "cash");
      setRemarks(editingExpense.remarks || "");
      if (editingExpense.items) {
        setItems(editingExpense.items.map(i => ({
          ...i,
          id: i.id || Math.random(),
          unit: i.unit || "pcs" // Ensure unit exists when editing
        })));
      }
    }
  }, [editingExpense]);

  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0);

  const handleItemChange = (id, field, value) => {
    setItems(items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  // FIX: Added 'unit' to new items
  const addItem = () => setItems([...items, { id: Date.now(), item_name: "", quantity: 1, unit_price: 0, unit: "pcs" }]);
  const removeItem = (id) => items.length > 1 && setItems(items.filter((item) => item.id !== id));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      date,
      description,
      category,
      supplier: supplier || null,
      payment_source: paymentSource,
      remarks: remarks || "",
      // FIX: Mapping the unit field into the payload
      items: items.map(({ id, ...rest }) => ({
        item_name: rest.item_name,
        quantity: Number(rest.quantity),
        unit_price: Number(rest.unit_price),
        unit: rest.unit || "pcs"
      })),
      vat_enabled: false
    };

    try {
      let response;
      if (editingExpense) {
        response = await updateExpense(editingExpense.id, payload);
      } else {
        response = await createExpense(payload);
      }
      onSubmit(response);
    } catch (err) {
      console.error("Backend Error Details:", err.response?.data);
      const errorDetail = err.response?.data?.detail || JSON.stringify(err.response?.data);
      alert("Error: " + errorDetail);
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
              <option>Food</option><option>Supplies</option><option>Utilities</option><option>Other</option>
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
              <span>Item Name</span><span>Qty</span><span>Unit</span><span>Price</span><span style={{ textAlign: "right" }}>Total</span><span></span>
            </div>
          </div>
          {items.map((item) => (
            <div key={item.id} style={tableGridRow}>
              <input style={inputStyle} value={item.item_name} onChange={(e) => handleItemChange(item.id, "item_name", e.target.value)} required placeholder="Item" />
              <input type="number" style={inputStyle} value={item.quantity} onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)} min="1" />

              {/* Added Unit Input */}
              <input type="text" style={inputStyle} value={item.unit} onChange={(e) => handleItemChange(item.id, "unit", e.target.value)} placeholder="pcs/kg" required />

              <input type="number" style={inputStyle} value={item.unit_price} onChange={(e) => handleItemChange(item.id, "unit_price", e.target.value)} min="0" />
              <div style={totalCell}>{(item.quantity * item.unit_price).toLocaleString()}</div>
              <button type="button" onClick={() => removeItem(item.id)} style={deleteBtn}>🗑</button>
            </div>
          ))}
        </div>

        <div style={summaryBox}>
          <div style={totalLine}>Grand Total: <span>{subtotal.toLocaleString()} ETB</span></div>
        </div>

        <FormField label="Payment Method">
          <div style={paymentRow}>
            {["cash", "bank"].map((s) => (
              <label key={s} style={radioCard(paymentSource === s)}>
                <input type="radio" value={s} checked={paymentSource === s} onChange={(e) => setPaymentSource(e.target.value)} hidden />
                {s.toUpperCase()}
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

// Styles - Update grid to accommodate the extra "Unit" column
const tableGridHeader = { display: "grid", gridTemplateColumns: "2.5fr 0.8fr 0.8fr 1.2fr 1.2fr 40px", gap: 10, fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#94a3b8" };
const tableGridRow = { display: "grid", gridTemplateColumns: "2.5fr 0.8fr 0.8fr 1.2fr 1.2fr 40px", gap: 10, marginBottom: 10, alignItems: "center" };

// ... Keep all other styles exactly as they were ...
const FormField = ({ label, children }) => ( <div style={{width: '100%'}}><label style={labelStyle}>{label}</label>{children}</div> );
const containerStyle = { background: "#fff", padding: 30, borderRadius: 12, border: "1px solid #e2e8f0", maxWidth: 950, margin: "auto" };
const inputStyle = { width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" };
const rowGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 25 };
const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", color: "#64748b" };
const titleStyle = { margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" };
const headerStyle = { display: "flex", justifyContent: "space-between", marginBottom: 25 };
const closeBtnStyle = { background: "none", border: "none", fontSize: 20, cursor: "pointer" };
const addItemBtn = { background: "#2563eb", border: "none", color: "#fff", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontWeight: 700 };
const tableHeaderRow = { marginBottom: 15 };
const totalCell = { textAlign: "right", fontWeight: 700 };
const deleteBtn = { border: "none", background: "none", cursor: "pointer", color: "#ef4444" };
const sectionLabel = { fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#475569" };
const summaryBox = { background: "#f8fafc", padding: 20, borderRadius: 10, border: "1px solid #e2e8f0", marginBottom: 25 };
const totalLine = { fontSize: 18, fontWeight: 800, color: "#2563eb", display: "flex", justifyContent: "space-between" };
const paymentRow = { display: "flex", gap: 10, marginBottom: 20 };
const radioCard = (active) => ({ flex: 1, padding: 12, textAlign: "center", borderRadius: 8, cursor: "pointer", fontWeight: 600, border: active ? "2px solid #2563eb" : "1px solid #e2e8f0", background: active ? "#eff6ff" : "#fff" });
const cancelBtn = { flex: 1, padding: 12, borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff", fontWeight: 600, cursor: "pointer" };
const submitBtn = { flex: 2, padding: 12, borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer" };