import React, { useState, useEffect } from "react";
import { createExpense, updateExpense } from "../../apis/expenses.api";

export default function ExpenseForm({ onSubmit, editingExpense, clearEdit }) {

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [supplier, setSupplier] = useState("");
  const [paymentSource, setPaymentSource] = useState("cash");
  const [remarks, setRemarks] = useState("");
  const [invoiceFile, setInvoiceFile] = useState(null);

  // ✅ NEW STATES FOR COMBINED SPLIT
  const [cashAmount, setCashAmount] = useState(0);
  const [bankAmount, setBankAmount] = useState(0);

  const [items, setItems] = useState([
    { id: Date.now(), item_name: "", quantity: 1, unit: "pcs", unit_price: 0, vat_rate: 0 }
  ]);

  // ==============================
  // LOAD EDITING DATA
  // ==============================
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
          id: i.id || Math.random()
        })));
      }
    }
  }, [editingExpense]);

  // Reset split if not combined
  useEffect(() => {
    if (paymentSource !== "combined") {
      setCashAmount(0);
      setBankAmount(0);
    }
  }, [paymentSource]);

  // ==============================
  // CALCULATIONS
  // ==============================
  const calculateRowTotal = (item) => {
    const subtotal = Number(item.quantity) * Number(item.unit_price);
    const vat = subtotal * (Number(item.vat_rate) / 100);
    return subtotal + vat;
  };

  const grandTotal = items.reduce((sum, item) => sum + calculateRowTotal(item), 0);

  // ==============================
  // ITEMS HANDLING
  // ==============================
  const handleItemChange = (id, field, value) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), item_name: "", quantity: 1, unit: "pcs", unit_price: 0, vat_rate: 0 }
    ]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  // ==============================
  // SUBMIT
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDATION FOR COMBINED
    if (paymentSource === "combined") {
      if (Number(cashAmount) + Number(bankAmount) !== grandTotal) {
        alert("Cash + Bank must equal Grand Total.");
        return;
      }
    }

    try {
      const formData = new FormData();

      formData.append("date", date);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("supplier", supplier || "");
      formData.append("payment_source", paymentSource);
      formData.append("remarks", remarks || "");

      if (invoiceFile) {
        formData.append("invoice", invoiceFile);
      }

      const processedItems = items.map(item => ({
        item_name: item.item_name,
        quantity: Number(item.quantity),
        unit: item.unit,
        unit_price: Number(item.unit_price),
        vat_rate: Number(item.vat_rate)
      }));

      formData.append("items_input", JSON.stringify(processedItems));

      // ✅ SEND SPLIT DATA IF COMBINED
      if (paymentSource === "combined") {
        formData.append("cash_amount", cashAmount);
        formData.append("bank_amount", bankAmount);
      }

      let res;

      if (editingExpense) {
        const expenseId = editingExpense.id;
        res = await updateExpense(expenseId, formData);
      } else {
        res = await createExpense(formData);
      }

      if (onSubmit) onSubmit(res);
      if (clearEdit) clearEdit();

    } catch (err) {
      if (err.response) {
        alert(err.response.data?.detail || JSON.stringify(err.response.data));
      } else {
        alert("Error submitting expense.");
      }
    }
  };

  // ==============================
  // UI
  // ==============================
  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit}>

        <h2>{editingExpense ? "Edit Expense" : "Add Expense"}</h2>

        <div style={rowGrid}>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} required />
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" style={inputStyle} required />
        </div>

        <div style={rowGrid}>
          <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
            <option value="Food">Food</option>
            <option value="Supplies">Supplies</option>
            <option value="Utilities">Utilities</option>
            <option value="Rent">Rent</option>
            <option value="Other">Other</option>
          </select>

          <input type="text" value={supplier} onChange={e => setSupplier(e.target.value)} placeholder="Supplier (Optional)" style={inputStyle} />
        </div>

        {/* ITEMS */}
        {items.map(item => (
          <div key={item.id} style={tableRow}>
            <input value={item.item_name} onChange={e => handleItemChange(item.id, "item_name", e.target.value)} placeholder="Item" style={inputStyle} required />
            <input type="number" value={item.quantity} onChange={e => handleItemChange(item.id, "quantity", e.target.value)} style={inputStyle} />
            <input type="number" value={item.unit_price} onChange={e => handleItemChange(item.id, "unit_price", e.target.value)} style={inputStyle} />
            <input type="number" value={item.vat_rate} onChange={e => handleItemChange(item.id, "vat_rate", e.target.value)} style={inputStyle} />
            <span>{calculateRowTotal(item).toFixed(2)}</span>
            <button type="button" onClick={() => removeItem(item.id)}>🗑</button>
          </div>
        ))}

        <button type="button" onClick={addItem}>+ Add Item</button>

        <h3>Total: {grandTotal.toFixed(2)} ETB</h3>

        {/* PAYMENT */}
        <div style={paymentRow}>
          {["cash", "bank", "combined"].map(s => (
            <label key={s}>
              <input
                type="radio"
                checked={paymentSource === s}
                onChange={() => setPaymentSource(s)}
              />
              {s.toUpperCase()}
            </label>
          ))}
        </div>

        {/* SPLIT FIELDS */}
        {paymentSource === "combined" && (
          <div style={rowGrid}>
            <input
              type="number"
              placeholder="Cash Amount"
              value={cashAmount}
              onChange={e => setCashAmount(Number(e.target.value))}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Bank Amount"
              value={bankAmount}
              onChange={e => setBankAmount(Number(e.target.value))}
              style={inputStyle}
            />
          </div>
        )}

        <textarea
          value={remarks}
          onChange={e => setRemarks(e.target.value)}
          placeholder="Remarks"
          style={inputStyle}
        />

        <input type="file" onChange={e => setInvoiceFile(e.target.files[0])} />

        <div style={{ marginTop: 20 }}>
          <button type="button" onClick={clearEdit}>Cancel</button>
          <button type="submit">Submit</button>
        </div>

      </form>
    </div>
  );
}

// ================= STYLES =================
const containerStyle = { padding: 20, background: "#fff", borderRadius: 10 };
const inputStyle = { width: "100%", padding: 8, marginBottom: 10 };
const rowGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 };
const tableRow = { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto", gap: 8, marginBottom: 8 };
const paymentRow = { display: "flex", gap: 20, marginTop: 10 };