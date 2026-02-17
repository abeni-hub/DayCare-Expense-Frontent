import { useState } from "react";

import Layout from "./shared/Layout";

import DashboardPage from "./features/dashboard/DashboardPage";
import AccountsPage from "./features/accounts/AccountsPage";
import ExpensesPage from "./features/expenses/ExpensesPage";
import IncomesPage from "./features/incomes/IncomesPage";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");

  const [accounts, setAccounts] = useState([
    { id: 1, name: "Cash", balance: 12500 },
    { id: 2, name: "Bank", balance: 45800 },
  ]);

  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  // 🔴 Expense Logic
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

  // 🟢 Income Logic
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
          />
        );

      case "incomes":
        return (
          <IncomesPage
            incomes={incomes}
            onAddIncome={addIncome}
          />
        );

      default:
        return <DashboardPage accounts={accounts} />;
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
