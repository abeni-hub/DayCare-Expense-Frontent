import { useState } from "react";

import Layout from "./shared/Layout";

import DashboardPage from "./features/dashboard/DashboardPage";
import AccountsPage from "./features/accounts/AccountsPage";
import ExpensesPage from "./features/expenses/ExpensesPage";
import IncomesPage from "./features/incomes/IncomesPage";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");

  // 🔹 Global Accounts State
  const [accounts, setAccounts] = useState([
    { id: 1, name: "Cash", balance: 12500 },
    { id: 2, name: "Bank", balance: 45800 },
  ]);

  // 🔹 Global Expenses State
  const [expenses, setExpenses] = useState([]);

  const addExpense = (expense) => {
    // Add expense to history
    setExpenses((prev) => [...prev, expense]);

    // Deduct from correct account
    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) =>
        acc.name === expense.account
          ? { ...acc, balance: acc.balance - expense.amount }
          : acc
      )
    );
  };

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardPage accounts={accounts} />;

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
        return <IncomesPage />;

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
