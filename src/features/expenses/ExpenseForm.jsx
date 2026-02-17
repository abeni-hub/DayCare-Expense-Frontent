import { useState, useEffect } from "react";

function ExpenseForm({ onSubmit, editingExpense, clearEdit }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("Cash");

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount);
      setAccount(editingExpense.account);
    }
  }, [editingExpense]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !amount) return;

    const expense = {
      id: editingExpense ? editingExpense.id : Date.now(),
      title,
      amount: Number(amount),
      account,
      date: new Date().toLocaleDateString(),
    };

    onSubmit(expense);

    setTitle("");
    setAmount("");
    setAccount("Cash");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#fff",
        padding: 20,
        marginBottom: 25,
      }}
    >
      <h3>
        {editingExpense ? "Edit Expense" : "Add Expense"}
      </h3>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        style={{ width: "100%", marginBottom: 10 }}
      />

      <select
        value={account}
        onChange={(e) => setAccount(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      >
        <option value="Cash">Cash</option>
        <option value="Bank">Bank</option>
      </select>

      <button type="submit">
        {editingExpense ? "Update Expense" : "Add Expense"}
      </button>

      {editingExpense && (
        <button
          type="button"
          onClick={clearEdit}
          style={{ marginLeft: 10 }}
        >
          Cancel
        </button>
      )}
    </form>
  );
}

export default ExpenseForm;
