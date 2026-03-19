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
      if (Math.abs((Number(cashAmount) + Number(bankAmount)) - grandTotal) > 0.01) {
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
      if (invoiceFile) formData.append("invoice", invoiceFile);

      const processedItems = items.map(item => ({
        item_name: item.item_name,
        quantity: Number(item.quantity),
        unit: item.unit,
        unit_price: Number(item.unit_price),
        vat_rate: Number(item.vat_rate || 0)// Ensure this is expected by DRF if you have VAT per item
      }));

      // ✅ Send as 'items' so DRF connects it to the serializer field
      formData.append("items", JSON.stringify(processedItems));

      if (paymentSource === "combined") {
        formData.append("cash_amount", cashAmount);
        formData.append("bank_amount", bankAmount);
      }

      let res = editingExpense
        ? await updateExpense(editingExpense.id, formData)
        : await createExpense(formData);

      if (onSubmit) onSubmit(res);
      if (clearEdit) clearEdit();
    } catch (err) {
      // 🚨 THIS WILL REVEAL THE EXACT DJANGO ERROR IN YOUR CONSOLE
      if (err.response && err.response.data) {
        console.error("🛑 DJANGO VALIDATION ERROR:", err.response.data);
        alert("Validation Error. Check console for details: " + JSON.stringify(err.response.data));
      } else {
        console.error("🛑 NETWORK/AXIOS ERROR:", err);
        alert("Error submitting expense: " + err.message);
      }
    }
  };

  return (
    <div style={styles.formContainer}>
      <form onSubmit={handleSubmit} style={styles.modernCard}>
        {/* HEADER */}
        <div style={styles.headerRow}>
          <h2 style={styles.titleText}>
            {editingExpense ? "📝 Edit Transaction" : "💰 New Expense Voucher"}
          </h2>
          <div style={styles.statusBadge}>
            Draft Mode
          </div>
        </div>

        {/* BASIC INFO SECTION */}
        <div style={styles.sectionHeader}>
          <span style={styles.sectionIcon}>📁</span>
          General Information
        </div>
        <div style={styles.gridContainer}>
          <Input label="Transaction Date" type="date" value={date} onChange={e => setDate(e.target.value)} />
          <Input label="Expense Description" placeholder="e.g. Monthly Grocery Purchase" value={description} onChange={e => setDescription(e.target.value)} />

          <Select label="Expense Category" value={category} onChange={e => setCategory(e.target.value)}>
            <option>Food</option>
            <option>Supplies</option>
            <option>Utilities</option>
            <option>Rent</option>
            <option>Other</option>
          </Select>
          <Input label="Vendor / Supplier" placeholder="Company Name" value={supplier} onChange={e => setSupplier(e.target.value)} />
        </div>

        {/* LINE ITEMS SECTION */}
        <div style={styles.sectionHeader}>
          <span style={styles.sectionIcon}>📋</span>
          Itemized Breakdown
        </div>

        <div style={styles.tableWrapper}>
            <div style={styles.tableHeaderRow}>
                <div style={{ flex: 2.5 }}>Item Name</div>
                <div style={{ flex: 1 }}>Qty</div>
                <div style={{ flex: 1 }}>Unit</div>
                <div style={{ flex: 1.5 }}>Price (ETB)</div>
                <div style={{ flex: 1 }}>VAT %</div>
                <div style={{ flex: 1.5, textAlign: 'right' }}>Subtotal</div>
                <div style={{ width: 40 }}></div>
            </div>

            {items.map(item => (
                <div key={item.id} style={styles.tableBodyRow}>
                    <div style={{ flex: 2.5 }}><input style={styles.tableInput} placeholder="Item description" value={item.item_name} onChange={e => handleItemChange(item.id, "item_name", e.target.value)} required/></div>
                    <div style={{ flex: 1 }}><input type="number" style={styles.tableInput} value={item.quantity} onChange={e => handleItemChange(item.id, "quantity", e.target.value)} required/></div>
                    <div style={{ flex: 1 }}><input style={styles.tableInput} value={item.unit} onChange={e => handleItemChange(item.id, "unit", e.target.value)} /></div>
                    <div style={{ flex: 1.5 }}><input type="number" step="any" style={styles.tableInput} placeholder="0.00" value={item.unit_price} onChange={e => handleItemChange(item.id, "unit_price", e.target.value)} required/></div>
                    <div style={{ flex: 1 }}><input type="number" step="any" style={styles.tableInput} value={item.vat_rate} onChange={e => handleItemChange(item.id, "vat_rate", e.target.value)} /></div>
                    <div style={styles.totalCell}>{calculateRowTotal(item).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                    <div style={{ width: 40, textAlign: 'right' }}>
                        <button type="button" style={styles.deleteRowBtn} onClick={() => removeItem(item.id)}>🗑️</button>
                    </div>
                </div>
            ))}
        </div>

        <button type="button" style={styles.addRowBtn} onClick={addItem}>
          + Add Line Item
        </button>

        {/* SETTLEMENT SECTION */}
        <div style={styles.summarySection}>
            <div style={styles.paymentCol}>
                <div style={styles.sectionHeaderSmall}>Settlement Method</div>
                <div style={styles.paymentButtonGroup}>
                    {["cash", "bank", "combined"].map(s => (
                        <div
                            key={s}
                            style={{
                                ...styles.methodCard,
                                borderColor: paymentSource === s ? "#2563eb" : "#e2e8f0",
                                backgroundColor: paymentSource === s ? "#eff6ff" : "#fff",
                                color: paymentSource === s ? "#1d4ed8" : "#64748b"
                            }}
                            onClick={() => setPaymentSource(s)}
                        >
                            <span style={{fontSize: '18px'}}>{s === 'cash' ? '💵' : s === 'bank' ? '🏦' : '⚖️'}</span>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </div>
                    ))}
                </div>

                {paymentSource === "combined" && (
                    <div style={styles.splitInputRow}>
                        <Input label="Cash Portion" type="number" step="any" value={cashAmount} onChange={e => setCashAmount(Number(e.target.value))} />
                        <Input label="Bank Portion" type="number" step="any" value={bankAmount} onChange={e => setBankAmount(Number(e.target.value))} />
                    </div>
                )}
            </div>

            <div style={styles.grandTotalContainer}>
                <div style={styles.totalLabel}>Grand Total Amount</div>
                <div style={styles.totalValue}>{grandTotal.toLocaleString()} <span style={{fontSize: '16px'}}>ETB</span></div>
                <div style={styles.totalDivider}></div>
                <div style={{fontSize: '12px', color: '#64748b', textAlign: 'right'}}>Incl. VAT Calculations</div>
            </div>
        </div>

        {/* ATTACHMENTS & REMARKS */}
        <div style={styles.gridContainer}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <label style={styles.fieldLabel}>Voucher Attachments (Invoice/Receipt)</label>
                <div style={styles.fileUploadBox}>
                    <input type="file" onChange={e => setInvoiceFile(e.target.files[0])} />
                </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <label style={styles.fieldLabel}>Internal Remarks</label>
                <textarea
                    placeholder="Add any specific notes about this transaction..."
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    style={styles.textArea}
                />
            </div>
        </div>

        {/* ACTION BUTTONS */}
        <div style={styles.actionFooter}>
            <button type="button" style={styles.secondaryBtn} onClick={clearEdit}>
                Discard Changes
            </button>
            <button type="submit" style={styles.primaryBtn}>
                Confirm & Sync Expense
            </button>
        </div>

      </form>
    </div>
  );
}

/* ---------- Reusable Sub-Components ---------- */
const Input = ({ label, ...props }) => (
  <div style={styles.inputGroup}>
    <label style={styles.fieldLabel}>{label}</label>
    <input {...props} style={styles.formInput} />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div style={styles.inputGroup}>
    <label style={styles.fieldLabel}>{label}</label>
    <div style={styles.selectWrapper}>
        <select {...props} style={styles.formSelect}>{children}</select>
    </div>
  </div>
);

/* ---------- PROFESSIONAL UI STYLES ---------- */
const styles = {
  formContainer: { padding: "20px 0", maxWidth: "1150px", margin: "0 auto" },
  modernCard: { backgroundColor: "#ffffff", borderRadius: "20px", padding: "40px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", border: "1px solid #f1f5f9" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: "1px solid #f1f5f9", paddingBottom: "20px" },
  titleText: { fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: 0 },
  statusBadge: { backgroundColor: "#f8fafc", color: "#64748b", padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", border: "1px solid #e2e8f0" },
  sectionHeader: { fontSize: "15px", fontWeight: "700", color: "#475569", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", letterSpacing: "0.5px" },
  sectionIcon: { backgroundColor: "#f1f5f9", padding: "6px", borderRadius: "8px", fontSize: "14px" },
  gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "35px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  fieldLabel: { fontSize: "13px", fontWeight: "600", color: "#64748b", marginLeft: "2px" },
  formInput: { padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", transition: "border 0.2s ease", backgroundColor: "#fcfcfd" },
  formSelect: { padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", width: "100%", backgroundColor: "#fcfcfd", appearance: "none", outline: "none" },
  tableWrapper: { backgroundColor: "#f8fafc", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9", marginBottom: "15px" },
  tableHeaderRow: { display: "flex", gap: "15px", padding: "0 10px 15px 10px", fontSize: "12px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" },
  tableBodyRow: { display: "flex", gap: "15px", padding: "10px", backgroundColor: "#ffffff", borderRadius: "12px", marginBottom: "10px", alignItems: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" },
  tableInput: { width: "100%", padding: "8px 12px", border: "none", fontSize: "14px", outline: "none", backgroundColor: "transparent" },
  totalCell: { flex: 1.5, textAlign: "right", fontWeight: "700", color: "#1e293b" },
  deleteRowBtn: { background: "none", border: "none", cursor: "pointer", opacity: "0.5", transition: "opacity 0.2s" },
  addRowBtn: { padding: "10px 20px", backgroundColor: "#ffffff", color: "#2563eb", border: "1px dashed #2563eb", borderRadius: "12px", fontWeight: "600", fontSize: "14px", cursor: "pointer", marginBottom: "40px" },
  summarySection: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "40px", padding: "30px", backgroundColor: "#f1f5f9", borderRadius: "20px", marginBottom: "35px" },
  paymentCol: { flex: 1 },
  sectionHeaderSmall: { fontSize: "13px", fontWeight: "700", color: "#64748b", marginBottom: "15px", textTransform: "uppercase" },
  paymentButtonGroup: { display: "flex", gap: "12px" },
  methodCard: { flex: 1, padding: "16px", borderRadius: "14px", border: "2px solid", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "700", transition: "all 0.2s" },
  splitInputRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "20px" },
  grandTotalContainer: { textAlign: "right", paddingLeft: "40px", borderLeft: "2px solid #e2e8f0" },
  totalLabel: { fontSize: "13px", fontWeight: "700", color: "#64748b", marginBottom: "5px" },
  totalValue: { fontSize: "36px", fontWeight: "900", color: "#0f172a" },
  totalDivider: { height: "1px", backgroundColor: "#cbd5e1", margin: "10px 0 10px auto", width: "150px" },
  textArea: { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", minHeight: "80px", fontSize: "14px", outline: "none", backgroundColor: "#fcfcfd" },
  fileUploadBox: { padding: "12px", border: "2px dashed #e2e8f0", borderRadius: "12px", backgroundColor: "#f8fafc" },
  actionFooter: { display: "flex", justifyContent: "flex-end", gap: "15px", marginTop: "20px", borderTop: "1px solid #f1f5f9", paddingTop: "30px" },
  primaryBtn: { backgroundColor: "#0f172a", color: "#fff", padding: "14px 28px", border: "none", borderRadius: "12px", fontWeight: "700", fontSize: "15px", cursor: "pointer", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" },
  secondaryBtn: { backgroundColor: "#f1f5f9", color: "#475569", padding: "14px 28px", border: "none", borderRadius: "12px", fontWeight: "700", fontSize: "15px", cursor: "pointer" }
};