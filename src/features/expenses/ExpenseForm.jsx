import { useState } from "react";

function ExpenseForm({ onAddExpense }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("Cash");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !amount) return;

    const newExpense = {
      id: Date.now(),
      title,
      amount: Number(amount),
      account,
      date: new Date().toLocaleDateString(),
    };

    onAddExpense(newExpense);

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
      <h3 style={{ marginBottom: "15px" }}>Add Expense</h3>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Expense Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "8px", width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: "8px", width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <select
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          style={{ padding: "8px", width: "100%" }}
        >
          <option value="Cash">Cash</option>
          <option value="Bank">Bank</option>
        </select>
      </div>

      <button
        type="submit"
        style={{
          padding: "10px 15px",
          backgroundColor: "#dc2626",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Add Expense
      </button>
    </form>
  );
}

export default ExpenseForm;
