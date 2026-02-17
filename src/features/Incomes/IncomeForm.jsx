import { useState } from "react";

function IncomeForm({ onAddIncome }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("Cash");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !amount) return;

    const newIncome = {
      id: Date.now(),
      title,
      amount: Number(amount),
      account,
      date: new Date().toLocaleDateString(),
    };

    onAddIncome(newIncome);

    setTitle("");
    setAmount("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "25px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>Add Income</h3>

      <input
        type="text"
        placeholder="Income Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
      />

      <select
        value={account}
        onChange={(e) => setAccount(e.target.value)}
        style={{ padding: "8px", width: "100%", marginBottom: "15px" }}
      >
        <option value="Cash">Cash</option>
        <option value="Bank">Bank</option>
      </select>

      <button
        type="submit"
        style={{
          padding: "10px 15px",
          backgroundColor: "#16a34a",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Add Income
      </button>
    </form>
  );
}

export default IncomeForm;
