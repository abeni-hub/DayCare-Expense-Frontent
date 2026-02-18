import { useState, useEffect } from "react";

function IncomeForm({ onSubmit, editingIncome, clearEdit }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("Cash");

  useEffect(() => {
    if (editingIncome) {
      setTitle(editingIncome.title);
      setAmount(editingIncome.amount);
      setAccount(editingIncome.account);
    }
  }, [editingIncome]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    const income = {
      id: editingIncome ? editingIncome.id : Date.now(),
      title,
      amount: Number(amount),
      account,
      date: editingIncome ? editingIncome.date : new Date().toLocaleDateString(),
    };

    onSubmit(income);
    setTitle("");
    setAmount("");
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    marginTop: "8px",
    outline: "none",
    transition: "border-color 0.2s"
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    display: "block"
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{ margin: "0 0 20px 0", fontSize: "18px" }}>
        {editingIncome ? "Edit Transaction" : "New Income Entry"}
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div>
          <label style={labelStyle}>Description / Source</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Monthly Tuition Fee"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Amount (ETB)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ marginBottom: "25px" }}>
        <label style={labelStyle}>Deposit To</label>
        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          {["Cash", "Bank"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setAccount(type)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: account === type ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                backgroundColor: account === type ? "#eff6ff" : "#fff",
                color: account === type ? "#1d4ed8" : "#64748b",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {type === "Cash" ? "💵 Cash" : "🏛️ Bank"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button type="submit" style={{
          flex: 2,
          backgroundColor: "#1e293b",
          color: "#fff",
          border: "none",
          padding: "14px",
          borderRadius: "8px",
          fontWeight: "600",
          cursor: "pointer"
        }}>
          {editingIncome ? "Save Changes" : "Confirm Income"}
        </button>

        <button type="button" onClick={clearEdit} style={{
          flex: 1,
          backgroundColor: "#f8fafc",
          color: "#64748b",
          border: "1px solid #e2e8f0",
          padding: "14px",
          borderRadius: "8px",
          fontWeight: "600",
          cursor: "pointer"
        }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default IncomeForm;