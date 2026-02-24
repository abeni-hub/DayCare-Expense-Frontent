import React, { useState, useEffect } from "react";
import { createIncome, updateIncome } from "../../apis/incomes.api";

function IncomeForm({ onSubmit, editingIncome, clearEdit }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("salary");
  const [amount, setAmount] = useState("");
  const [paymentSource, setPaymentSource] = useState("cash");
  const [remarks, setRemarks] = useState("");

  const [cashAmount, setCashAmount] = useState(0);
  const [bankAmount, setBankAmount] = useState(0);

  useEffect(() => {
    if (editingIncome) {
      setDate(editingIncome.date || new Date().toISOString().split("T")[0]);
      setDescription(editingIncome.description || "");
      setCategory(editingIncome.category || "salary");
      setAmount(editingIncome.amount || "");
      setPaymentSource(editingIncome.payment_source || "cash");
      setRemarks(editingIncome.remarks || "");
      setCashAmount(editingIncome.amount_cash || 0);
      setBankAmount(editingIncome.amount_bank || 0);
    }
  }, [editingIncome]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentSource === "combined") {
      const totalSplit = Number(cashAmount) + Number(bankAmount);
      if (Math.abs(totalSplit - Number(amount)) > 0.01) {
        alert(`Cash + Bank must equal Amount (${amount} ETB)`);
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("date", date);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("amount", amount);
      formData.append("payment_source", paymentSource);
      formData.append("remarks", remarks || "");

      if (paymentSource === "combined") {
        formData.append("amount_cash", cashAmount);
        formData.append("amount_bank", bankAmount);
      }

      let res;
      if (editingIncome) {
        res = await updateIncome(editingIncome.id, formData);
      } else {
        res = await createIncome(formData);
      }

      onSubmit(res);
      if (clearEdit) clearEdit();

      // Reset form
      setDescription("");
      setAmount("");
      setCashAmount(0);
      setBankAmount(0);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Error saving income");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{ margin: "0 0 20px 0", fontSize: "18px" }}>
        {editingIncome ? "Edit Income" : "New Income Entry"}
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", display: "block" }}>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0" }} required />
        </div>
        <div>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", display: "block" }}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <option value="salary">Salary</option>
            <option value="sales">Sales</option>
            <option value="investment">Investment</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", display: "block" }}>Description / Source</label>
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., Monthly Tuition Fee" style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0" }} required />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", display: "block" }}>Amount (ETB)</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0" }} required />
      </div>

      <div style={{ marginBottom: "25px" }}>
        <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", display: "block" }}>Deposit To</label>
        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          {["cash", "bank", "combined"].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setPaymentSource(s)}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: paymentSource === s ? "2px solid #2563eb" : "1px solid #e2e8f0",
                backgroundColor: paymentSource === s ? "#eff6ff" : "#fff",
                color: paymentSource === s ? "#2563eb" : "#64748b",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              {s === "combined" ? "BOTH / COMBINED" : s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {paymentSource === "combined" && (
        <div style={{ marginBottom: "25px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", display: "block" }}>Cash Amount (ETB)</label>
            <input type="number" value={cashAmount} onChange={e => setCashAmount(Number(e.target.value))} style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0" }} step="0.01" />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", display: "block" }}>Bank Amount (ETB)</label>
            <input type="number" value={bankAmount} onChange={e => setBankAmount(Number(e.target.value))} style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0" }} step="0.01" />
          </div>
        </div>
      )}

      <div style={{ marginBottom: "25px" }}>
        <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", display: "block" }}>Remarks (Optional)</label>
        <textarea value={remarks} onChange={e => setRemarks(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", minHeight: "80px" }} />
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button type="submit" style={{ flex: 2, backgroundColor: "#10b981", color: "#fff", border: "none", padding: "14px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
          {editingIncome ? "Save Changes" : "Confirm Income"}
        </button>
        <button type="button" onClick={clearEdit} style={{ flex: 1, backgroundColor: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", padding: "14px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default IncomeForm;