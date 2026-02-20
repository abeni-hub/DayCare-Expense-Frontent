import React, { useState, useEffect } from "react";
import { createExpense, updateExpense } from "../../apis/expenses.api";

export default function ExpenseForm({ onSubmit, editingExpense, clearEdit }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [supplier, setSupplier] = useState("");
  const [paymentSource, setPaymentSource] = useState("cash");
  const [remarks, setRemarks] = useState("");

  const [items, setItems] = useState([
    { id: Date.now(), item_name: "", quantity: 1, unit: "pcs", unit_price: 0, vat_rate: 0 }
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
          vat_rate: i.vat_rate || 0
        })));
      }
    }
  }, [editingExpense]);

  // CALCULATION
  const calculateRowTotal = (item) => {
    const subtotal = Number(item.quantity) * Number(item.unit_price);
    const vat = subtotal * (Number(item.vat_rate) / 100);
    return subtotal + vat;
  };

  const grandTotal = items.reduce((sum, item) => sum + calculateRowTotal(item), 0);

  const handleItemChange = (id, field, value) => {
    setItems(items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => setItems([...items, { id: Date.now(), item_name: "", quantity: 1, unit: "pcs", unit_price: 0, vat_rate: 0 }]);
  const removeItem = (id) => items.length > 1 && setItems(items.filter((item) => item.id !== id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      date,
      description,
      category,
      supplier: supplier || null,
      payment_source: paymentSource,
      remarks,
      items: items.map(({ id, ...rest }) => ({
        ...rest,
        quantity: Number(rest.quantity),
        unit_price: Number(rest.unit_price),
        vat_rate: Number(rest.vat_rate)
      })),
      // We send vat_enabled as true if ANY item has a VAT rate > 0
      vat_enabled: items.some(i => Number(i.vat_rate) > 0)
    };

    try {
      const res = editingExpense ? await updateExpense(editingExpense.id, payload) : await createExpense(payload);
      onSubmit(res);
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || "Check console for field details."));
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>{editingExpense ? "Edit Expense" : "Add New Expense"}</h2>
          <button type="button" onClick={clearEdit} style={closeBtnStyle}>✕</button>
        </div>

        {/* TOP ROW: Date and Description */}
        <div style={rowGrid}>
          <FormField label="Date *"><input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} required /></FormField>
          <FormField label="Description *"><input type="text" value={description} onChange={e => setDescription(e.target.value)} style={inputStyle} required /></FormField>
        </div>

        {/* SECOND ROW: Category and Supplier */}
        <div style={rowGrid}>
          <FormField label="Category">
            <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
              <option value="Food">Food</option>
              <option value="Supplies">Supplies</option>
              <option value="Utilities">Utilities</option>
              <option value="Rent">Rent</option>
              <option value="Other">Other</option>
            </select>
          </FormField>
          <FormField label="Supplier">
            <input type="text" value={supplier} onChange={e => setSupplier(e.target.value)} style={inputStyle} placeholder="Optional" />
          </FormField>
        </div>

        {/* ITEMS TABLE */}
        <div style={{ marginBottom: 30 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={sectionLabel}>Items & Taxation</span>
            <button type="button" onClick={addItem} style={addItemBtn}>+ Add Item</button>
          </div>

          <div style={tableGridHeader}>
            <span>Item Name</span><span>Qty</span><span>Unit</span><span>Price</span><span>VAT %</span><span style={{textAlign: 'right'}}>Total</span><span></span>
          </div>

          {items.map((item) => (
            <div key={item.id} style={tableGridRow}>
              <input style={inputStyle} value={item.item_name} onChange={e => handleItemChange(item.id, "item_name", e.target.value)} required placeholder="Item" />
              <input type="number" style={inputStyle} value={item.quantity} onChange={e => handleItemChange(item.id, "quantity", e.target.value)} />
              <input type="text" style={inputStyle} value={item.unit} onChange={e => handleItemChange(item.id, "unit", e.target.value)} required />
              <input type="number" style={inputStyle} value={item.unit_price} onChange={e => handleItemChange(item.id, "unit_price", e.target.value)} />
              <input
                type="number"
                style={{...inputStyle, background: '#f0f9ff', borderColor: '#bae6fd'}}
                value={item.vat_rate}
                onChange={e => handleItemChange(item.id, "vat_rate", e.target.value)}
                placeholder="0"
              />
              <div style={totalCell}>{calculateRowTotal(item).toLocaleString()}</div>
              <button type="button" onClick={() => removeItem(item.id)} style={deleteBtn}>🗑</button>
            </div>
          ))}
        </div>

        <div style={summaryBox}>
          <div style={totalLine}>Grand Total (Inc. VAT): <span>{grandTotal.toLocaleString()} ETB</span></div>
        </div>

        <FormField label="Payment Account">
          <div style={paymentRow}>
            {["cash", "bank"].map(s => (
              <label key={s} style={radioCard(paymentSource === s)}>
                <input type="radio" checked={paymentSource === s} onChange={() => setPaymentSource(s)} hidden />
                {s.toUpperCase()}
              </label>
            ))}
          </div>
        </FormField>

        <div style={{ display: "flex", gap: 15 }}>
          <button type="button" onClick={clearEdit} style={cancelBtn}>Cancel</button>
          <button type="submit" style={submitBtn}>Complete Transaction</button>
        </div>
      </form>
    </div>
  );
}

// STYLES
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

// Updated Grid for VAT column
const tableGridHeader = { display: "grid", gridTemplateColumns: "2.2fr 0.6fr 0.7fr 1.2fr 0.8fr 1.2fr 40px", gap: 10, fontSize: 11, fontWeight: 800, color: "#94a3b8" };
const tableGridRow = { display: "grid", gridTemplateColumns: "2.2fr 0.6fr 0.7fr 1.2fr 0.8fr 1.2fr 40px", gap: 10, marginBottom: 10, alignItems: "center" };