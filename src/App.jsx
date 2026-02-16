import { useState } from "react";

import Layout from "./shared/Layout";

import DashboardPage from "./features/dashboard/DashboardPage";
import AccountsPage from "./features/accounts/AccountsPage";
import ExpensesPage from "./features/expenses/ExpensesPage";
import IncomesPage from "./features/Incomes/IncomesPage";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardPage />;

      case "accounts":
        return <AccountsPage />;

      case "expenses":
        return <ExpensesPage />;

      case "income":
        return <IncomesPage />;

      default:
        return <DashboardPage />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default App;
