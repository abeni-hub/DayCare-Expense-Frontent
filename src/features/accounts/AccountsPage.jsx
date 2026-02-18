import React from "react";
import AccountSummary from "./AccountSummary";

function AccountsPage({ accounts = [] }) {
  if (!accounts || accounts.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "#64748b" }}>
        <div style={{ fontSize: "50px", marginBottom: "20px" }}>🏦</div>
        <h3>No accounts available</h3>
        <p>Please initialize your cash and bank accounts in settings.</p>
      </div>
    );
  }

  const combinedBalance = accounts.reduce(
    (sum, acc) => sum + acc.balance,
    0
  );

  const combinedAccount = {
    id: "combined",
    name: "Total Assets",
    balance: combinedBalance,
  };

  // Calculate percentage split for the fancy bar
  const cashAcc = accounts.find(a => a.name.toLowerCase().includes("cash"));
  const bankAcc = accounts.find(a => a.name.toLowerCase().includes("bank"));

  const cashPercent = combinedBalance > 0 ? ((cashAcc?.balance || 0) / combinedBalance) * 100 : 50;

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
            Accounts Overview
          </h1>
          <p style={{ color: "#64748b", marginTop: "8px" }}>Manage your liquidity and asset distribution.</p>
        </div>

        <button style={{
          backgroundColor: "#fff",
          border: "1px solid #e2e8f0",
          padding: "10px 20px",
          borderRadius: "10px",
          fontWeight: "600",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          📥 Download Report
        </button>
      </div>

      {/* Fancy Distribution Bar */}
      <div style={{ marginBottom: "40px", backgroundColor: "#fff", padding: "20px", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px", fontWeight: "600" }}>
          <span style={{ color: "#3b82f6" }}>Bank Balance ({Math.round(100 - cashPercent)}%)</span>
          <span style={{ color: "#10b981" }}>Cash Balance ({Math.round(cashPercent)}%)</span>
        </div>
        <div style={{ height: "12px", width: "100%", backgroundColor: "#f1f5f9", borderRadius: "10px", display: "flex", overflow: "hidden" }}>
          <div style={{ width: `${100 - cashPercent}%`, backgroundColor: "#3b82f6", transition: "width 1s ease" }} />
          <div style={{ width: `${cashPercent}%`, backgroundColor: "#10b981", transition: "width 1s ease" }} />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "30px",
          flexWrap: "wrap",
        }}
      >
        {/* Combined Account - Always first */}
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

      {/* Helpful Info Section */}
      <div style={{
        marginTop: "50px",
        padding: "25px",
        backgroundColor: "#eff6ff",
        borderRadius: "16px",
        border: "1px solid #dbeafe",
        color: "#1e40af",
        display: "flex",
        alignItems: "center",
        gap: "15px"
      }}>
        <span style={{ fontSize: "24px" }}>💡</span>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5" }}>
          <strong>Pro-tip:</strong> Your combined balance includes both physical cash and digital bank assets.
          Keep your bank-to-cash ratio healthy to ensure you can cover daily daycare operational costs.
        </p>
      </div>
    </div>
  );
}

export default AccountsPage;