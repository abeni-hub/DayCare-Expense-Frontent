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

  const [cashAmount, setCashAmount] = useState(0);
  const [bankAmount, setBankAmount] = useState(0);

  const [items, setItems] = useState([
    { id: Date.now(), item_name: "", quantity: 1, unit: "pcs", unit_price: "", vat_rate: 0 }
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
          id: i.id || Math.random()
        })));
      }
    }
  }, [editingExpense]);

  useEffect(() => {
    if (paymentSource !== "combined") {
      setCashAmount(0);
      setBankAmount(0);
    }
  }, [paymentSource]);

  const calculateRowTotal = (item) => {
    const subtotal = Number(item.quantity || 0) * Number(item.unit_price || 0);
    const vat = subtotal * (Number(item.vat_rate || 0) / 100);
    return subtotal + vat;
  };

  const grandTotal = items.reduce((sum, item) => sum + calculateRowTotal(item), 0);

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), item_name: "", quantity: 1, unit: "pcs", unit_price: "", vat_rate: 0 }
    ]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      if (paymentSource === "combined") {
        formData.append("cash_amount", cashAmount);
        formData.append("bank_amount", bankAmount);
      }

      let res;

      if (editingExpense) {
        res = await updateExpense(editingExpense.id, formData);
      } else {
        res = await createExpense(formData);
      }

      if (onSubmit) onSubmit(res);
      if (clearEdit) clearEdit();

    } catch (err) {
      alert("Error submitting expense.");
    }
  };

  return (
    <div style={pageWrapper}>
      <form onSubmit={handleSubmit} style={card}>

        <h2 style={title}>
          {editingExpense ? "✏️ Edit Expense" : "💰 Add Expense"}
        </h2>

        {/* BASIC INFO */}
        <div style={grid2}>
          <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} />
          <Input label="Description" value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div style={grid2}>
          <Select label="Category" value={category} onChange={e => setCategory(e.target.value)}>
            <option>Food</option>
            <option>Supplies</option>
            <option>Utilities</option>
            <option>Rent</option>
            <option>Other</option>
          </Select>
          <Input label="Supplier" value={supplier} onChange={e => setSupplier(e.target.value)} />
        </div>

        {/* ITEMS TABLE */}
        <h3 style={sectionTitle}>Items</h3>

        <div style={tableHeader}>
          <span>Item</span>
          <span>Qty</span>
          <span>Unit</span>
          <span>Unit Price</span>
          <span>VAT %</span>
          <span>Total</span>
          <span></span>
        </div>

        {items.map(item => (
          <div key={item.id} style={tableRow}>
            <input style={tableInput} value={item.item_name} onChange={e => handleItemChange(item.id, "item_name", e.target.value)} />
            <input type="number" style={tableInput} value={item.quantity} onChange={e => handleItemChange(item.id, "quantity", e.target.value)} />
            <input style={tableInput} value={item.unit} onChange={e => handleItemChange(item.id, "unit", e.target.value)} />
            <input type="number" style={tableInput} value={item.unit_price} onChange={e => handleItemChange(item.id, "unit_price", e.target.value)} />
            <input type="number" style={tableInput} value={item.vat_rate} onChange={e => handleItemChange(item.id, "vat_rate", e.target.value)} />
            <span style={totalCell}>{calculateRowTotal(item).toFixed(2)}</span>
            <button type="button" style={deleteBtn} onClick={() => removeItem(item.id)}>✖</button>
          </div>
        ))}

        <button type="button" style={addBtn} onClick={addItem}>+ Add Item</button>

        <div style={grandTotalBox}>
          Grand Total: {grandTotal.toFixed(2)} ETB
        </div>

        {/* PAYMENT */}
        <h3 style={sectionTitle}>Payment Method</h3>

        <div style={paymentCards}>
          {["cash", "bank", "combined"].map(s => (
            <div
              key={s}
              style={{
                ...paymentCard,
                border: paymentSource === s ? "2px solid #2563eb" : "1px solid #ddd",
                background: paymentSource === s ? "#eff6ff" : "#fff"
              }}
              onClick={() => setPaymentSource(s)}
            >
              {s.toUpperCase()}
            </div>
          ))}
        </div>

        {paymentSource === "combined" && (
          <div style={grid2}>
            <Input label="Cash Amount" type="number" value={cashAmount} onChange={e => setCashAmount(Number(e.target.value))} />
            <Input label="Bank Amount" type="number" value={bankAmount} onChange={e => setBankAmount(Number(e.target.value))} />
          </div>
        )}

        <textarea
          placeholder="Remarks..."
          value={remarks}
          onChange={e => setRemarks(e.target.value)}
          style={textareaStyle}
        />

        <input type="file" onChange={e => setInvoiceFile(e.target.files[0])} />

        <div style={buttonRow}>
          <button type="button" style={cancelBtn} onClick={clearEdit}>Cancel</button>
          <button type="submit" style={submitBtn}>Save Expense</button>
        </div>

      </form>
    </div>
  );
}

/* ---------- Reusable Components ---------- */
const Input = ({ label, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 600 }}>{label}</label>
    <input {...props} style={modernInput} />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 600 }}>{label}</label>
    <select {...props} style={modernInput}>{children}</select>
  </div>
);

/* ---------- Styles ---------- */

const pageWrapper = {
  background: "#f4f6f9",
  padding: 30,
  minHeight: "100vh"
};

const card = {
  background: "#fff",
  padding: 30,
  borderRadius: 12,
  boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
  maxWidth: 1100,
  margin: "auto"
};

const title = { marginBottom: 25 };

const sectionTitle = { marginTop: 30, marginBottom: 10 };

const grid2 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20,
  marginBottom: 20
};

const modernInput = {
  padding: "10px 12px",
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 14
};

const tableHeader = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 40px",
  fontWeight: 600,
  marginBottom: 8
};

const tableRow = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 40px",
  gap: 8,
  marginBottom: 8,
  alignItems: "center"
};

const tableInput = {
  padding: 6,
  border: "1px solid #ccc",
  borderRadius: 4
};

const totalCell = { fontWeight: 600 };

const addBtn = {
  marginTop: 10,
  padding: "8px 12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};

const grandTotalBox = {
  marginTop: 20,
  padding: 15,
  background: "#f1f5f9",
  borderRadius: 6,
  fontWeight: 700,
  textAlign: "right"
};

const paymentCards = {
  display: "flex",
  gap: 15,
  marginBottom: 20
};

const paymentCard = {
  padding: 15,
  borderRadius: 8,
  cursor: "pointer",
  flex: 1,
  textAlign: "center",
  fontWeight: 600
};

const textareaStyle = {
  width: "100%",
  marginTop: 15,
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ccc"
};

const buttonRow = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 20
};

const submitBtn = {
  background: "#16a34a",
  color: "#fff",
  padding: "10px 18px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};

const cancelBtn = {
  background: "#ef4444",
  color: "#fff",
  padding: "10px 18px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};

const deleteBtn = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: 16
};