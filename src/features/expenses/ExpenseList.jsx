import { useState, useEffect } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";

const API_URL = "http://127.0.0.1:8000/api/expenses/";

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch expenses from backend
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setExpenses(data);
  };

  const handleAddExpense = async (payload) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.detail || "Error creating expense");
        return;
      }

      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditExpense = async (payload) => {
    try {
      const res = await fetch(`${API_URL}${payload.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.detail || "Error updating expense");
        return;
      }

      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExpense = async (id) => {
    await fetch(`${API_URL}${id}/`, { method: "DELETE" });
    fetchExpenses();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Expenses</h2>

      <button onClick={() => setIsAdding(true)}>
        + Add Expense
      </button>

      {(isAdding || editingExpense) && (
        <ExpenseForm
          editingExpense={editingExpense}
          onSubmit={(data) => {
            if (editingExpense) {
              handleEditExpense(data);
            } else {
              handleAddExpense(data);
            }
            setEditingExpense(null);
            setIsAdding(false);
          }}
          clearEdit={() => {
            setEditingExpense(null);
            setIsAdding(false);
          }}
        />
      )}

      <ExpenseList
        expenses={expenses}
        onDeleteExpense={handleDeleteExpense}
        onEditClick={(exp) => setEditingExpense(exp)}
      />
    </div>
  );
}

export default ExpensesPage;