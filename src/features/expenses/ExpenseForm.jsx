import { useState, useEffect } from "react";

function ExpenseForm({ onSubmit, editingExpense, clearEdit }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [supplier, setSupplier] = useState("");
  const [items, setItems] = useState([{ id: Date.now(), name: "", qty: 1, unit: "pcs", price: 0 }]);
  const [paymentSource, setPaymentSource] = useState("Cash");
  const [cashAmount, setCashAmount] = useState(0);
  const [bankAmount, setBankAmount] = useState(0);
  const [includeVAT, setIncludeVAT] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [invoiceFile, setInvoiceFile] = useState(null);

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
      setIncludeVAT(editingExpense.includeVAT || false);
      setRemarks(editingExpense.remarks || "");
    }
  }, [editingExpense]);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.price)), 0);
  const vatAmount = includeVAT ? subtotal * 0.15 : 0;
  const totalExpense = subtotal + vatAmount;

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation for "Both" payment source
    if (paymentSource === "Both" && (Number(cashAmount) + Number(bankAmount) !== totalExpense)) {
      alert(`The sum of Cash (${cashAmount}) and Bank (${bankAmount}) must equal the total (${totalExpense})`);
      return;
    }

    const expense = {
      id: editingExpense ? editingExpense.id : Date.now(),
      date,
      description,
      category,
      supplier,
      items,
      paymentSource,
      cashAmount: paymentSource === "Both" ? cashAmount : (paymentSource === "Cash" ? totalExpense : 0),
      bankAmount: paymentSource === "Both" ? bankAmount : (paymentSource === "Bank" ? totalExpense : 0),
      subtotal,
      vatAmount,
      total: totalExpense,
      remarks,
      invoiceName: invoiceFile ? invoiceFile.name : null
    };

    onSubmit(expense);
  };

  return (
    <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#1e293b" }}>Add New Expense</h2>
          <button type="button" onClick={clearEdit} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#94a3b8" }}>&times;</button>
        </div>

        {/* Basic Info Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "25px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#64748b", marginBottom: "8px" }}>Date *</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} required />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#64748b", marginBottom: "8px" }}>Description *</label>
            <input type="text" placeholder="e.g., Supermarket Purchase" value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} required />
          </div>
        </div>

        {/* Items Section */}
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ margin: "0 0 15px 0", color: "#334155" }}>Expense Items</h4>
          {items.map((item) => (
            <div key={item.id} style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
              <input style={{ flex: 3, ...inputStyle }} placeholder="Item Name" value={item.name} onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} />
              <input style={{ flex: 1, ...inputStyle }} type="number" placeholder="Qty" value={item.qty} onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)} />
              <input style={{ flex: 1, ...inputStyle }} type="number" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', e.target.value)} />
              <div style={{ alignSelf: "center", fontWeight: "600", minWidth: "80px", textAlign: "right" }}>{(item.qty * item.price).toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* VAT and Total Section */}
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "15px", marginBottom: "25px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input type="checkbox" checked={includeVAT} onChange={(e) => setIncludeVAT(e.target.checked)} />
              Include VAT (15%)
            </label>
            <span style={{ color: "#64748b" }}>VAT: {vatAmount.toFixed(2)} ETB</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "bold", color: "#2563eb" }}>
            <span>Total Expense:</span>
            <span>{totalExpense.toFixed(2)} ETB</span>
          </div>
        </div>

        {/* Payment Source Section */}
        <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "8px", marginBottom: "25px", border: "1px solid #e2e8f0" }}>
          <label style={{ display: "block", marginBottom: "15px", fontWeight: "600" }}>Payment Source</label>
          <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
            {["Cash", "Bank", "Both"].map(source => (
              <label key={source} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <input type="radio" name="payment" value={source} checked={paymentSource === source} onChange={(e) => setPaymentSource(e.target.value)} />
                {source}
              </label>
            ))}
          </div>

          {paymentSource === "Both" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "5px" }}>Amount from Cash (ETB)</label>
                <input type="number" value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "5px" }}>Amount from Bank (ETB)</label>
                <input type="number" value={bankAmount} onChange={(e) => setBankAmount(e.target.value)} style={inputStyle} />
              </div>
            </div>
          )}
        </div>

        {/* Final Inputs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", marginBottom: "8px" }}>Upload Invoice</label>
            <input type="file" onChange={(e) => setInvoiceFile(e.target.files[0])} style={{ width: "100%" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "14px", marginBottom: "8px" }}>Remarks</label>
            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Optional notes" style={{ ...inputStyle, height: "40px", resize: "none" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <button type="button" onClick={clearEdit} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}>Cancel</button>
          <button type="submit" style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", background: "#2563eb", color: "#fff", fontWeight: "600", cursor: "pointer" }}>Add Expense</button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
  boxSizing: "border-box"
};

export default ExpenseForm;