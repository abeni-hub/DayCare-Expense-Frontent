import { useState, useEffect } from "react";

import Layout from "./shared/Layout";

import DashboardPage from "./features/dashboard/DashboardPage";
import AccountsPage from "./features/accounts/AccountsPage";
import ExpensesPage from "./features/expenses/ExpensesPage";
import IncomesPage from "./features/incomes/IncomesPage";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");

  // ------------------ ACCOUNTS ------------------
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem("accounts");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, name: "Cash", balance: 12500 },
          { id: 2, name: "Bank", balance: 45800 },
        ];
  });

  // ------------------ EXPENSES ------------------
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  // ------------------ INCOMES ------------------
  const [incomes, setIncomes] = useState(() => {
    const saved = localStorage.getItem("incomes");
    return saved ? JSON.parse(saved) : [];
  });

  // ------------------ PERSISTENCE ------------------
  useEffect(() => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("incomes", JSON.stringify(incomes));
  }, [incomes]);

  // ================== EXPENSE LOGIC ==================

  const addExpense = (expense) => {
    setExpenses((prev) => [...prev, expense]);

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.name === expense.account
          ? { ...acc, balance: acc.balance - expense.amount }
          : acc
      )
    );
  };

  const deleteExpense = (expenseId) => {
    const expense = expenses.find((e) => e.id === expenseId);
    if (!expense) return;

    // Refund account
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.name === expense.account
          ? { ...acc, balance: acc.balance + expense.amount }
          : acc
      )
    );

    setExpenses((prev) =>
      prev.filter((e) => e.id !== expenseId)
    );
  };

  const editExpense = (updatedExpense) => {
    const oldExpense = expenses.find(
      (e) => e.id === updatedExpense.id
    );
    if (!oldExpense) return;

    setAccounts((prev) =>
      prev.map((acc) => {
        let updatedAcc = { ...acc };

        // Reverse old
        if (acc.name === oldExpense.account) {
          updatedAcc.balance += oldExpense.amount;
        }

        // Apply new
        if (acc.name === updatedExpense.account) {
          updatedAcc.balance -= updatedExpense.amount;
        }

        return updatedAcc;
      })
    );

    setExpenses((prev) =>
      prev.map((e) =>
        e.id === updatedExpense.id ? updatedExpense : e
      )
    );
  };

  // ================== INCOME LOGIC ==================

  const addIncome = (income) => {
    setIncomes((prev) => [...prev, income]);

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.name === income.account
          ? { ...acc, balance: acc.balance + income.amount }
          : acc
      )
    );
  };

  const deleteIncome = (incomeId) => {
    const income = incomes.find((i) => i.id === incomeId);
    if (!income) return;

    // Remove added money
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.name === income.account
          ? { ...acc, balance: acc.balance - income.amount }
          : acc
      )
    );

    setIncomes((prev) =>
      prev.filter((i) => i.id !== incomeId)
    );
  };

  const editIncome = (updatedIncome) => {
    const oldIncome = incomes.find(
      (i) => i.id === updatedIncome.id
    );
    if (!oldIncome) return;

    setAccounts((prev) =>
      prev.map((acc) => {
        let updatedAcc = { ...acc };

        // Reverse old
        if (acc.name === oldIncome.account) {
          updatedAcc.balance -= oldIncome.amount;
        }

        // Apply new
        if (acc.name === updatedIncome.account) {
          updatedAcc.balance += updatedIncome.amount;
        }

        return updatedAcc;
      })
    );

    setIncomes((prev) =>
      prev.map((i) =>
        i.id === updatedIncome.id ? updatedIncome : i
      )
    );
  };

  // ================== VIEW RENDER ==================

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <DashboardPage
            accounts={accounts}
            expenses={expenses}
            incomes={incomes}
          />
        );

      case "accounts":
        return <AccountsPage accounts={accounts} />;

      case "expenses":
        return (
          <ExpensesPage
            expenses={expenses}
            onAddExpense={addExpense}
            onDeleteExpense={deleteExpense}
            onEditExpense={editExpense}
          />
        );

      case "incomes":
        return (
          <IncomesPage
            incomes={incomes}
            onAddIncome={addIncome}
            onDeleteIncome={deleteIncome}
            onEditIncome={editIncome}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Layout
      currentView={currentView}
      onViewChange={setCurrentView}
    >
      {renderView()}
    </Layout>
  );
}

export default App;
