import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

import Login from "./auth/Login";

import Layout from "./shared/Layout";

import DashboardPage from "./features/dashboard/DashboardPage";
import AccountsPage from "./features/accounts/AccountsPage";
import ExpensesPage from "./features/expenses/ExpensesPage";
import IncomesPage from "./features/Incomes/IncomesPage";

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState("dashboard");

  if (!isAuthenticated) {
    return <Login />;
  }

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

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
