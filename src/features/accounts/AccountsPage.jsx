import React from "react";
import AccountSummary from "./AccountSummary";

function AccountsPage({ accounts = [] }) {
  if (!accounts || accounts.length === 0) return <p>No accounts found.</p>;

  const combinedBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const combinedAccount = {
    id: "combined",
    name: "Combined Total",
    balance: combinedBalance,
  };

  return (
    <div style={{ padding: "10px" }}>
      <header style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a" }}>My Accounts</h1>
        <p style={{ color: "#64748b" }}>Overview of your daycare's financial assets.</p>
      </header>

      {/* HORIZONTAL CARDS CONTAINER */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          paddingBottom: "20px",
          paddingLeft: "5px",
          scrollBehavior: "smooth",
          // Hide scrollbar for Chrome/Safari/Firefox
          msOverflowStyle: "none",
          scrollbarWidth: "none"
        }}
      >
        {/* Combined Account First */}
        <AccountSummary account={combinedAccount} isCombined={true} />

        {/* Individual Accounts */}
        {accounts.map((account) => (
          <AccountSummary
            key={account.id}
            account={account}
            isCombined={false}
          />
        ))}
      </div>

      {/* Stats Breakdown Section below cards */}
      <div style={{
        marginTop: "40px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "24px"
      }}>
        <div style={detailBox}>
          <h4>Asset Concentration</h4>
          <p>Your largest holding is currently in your <strong>Bank Account</strong>.</p>
        </div>
        <div style={detailBox}>
          <h4>Recent Activity</h4>
          <p>No major transfers detected in the last 24 hours.</p>
        </div>
      </div>
    </div>
  );
}

const detailBox = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  fontSize: "14px",
  color: "#475569"
};

export default AccountsPage;