import React from "react";

function AccountSummary({ account, isCombined }) {
  if (!account) return null;

  const isBank = account.name.toLowerCase().includes("bank");
  const isCash = account.name.toLowerCase().includes("cash");

  // Professional gradient selection for a white background layout
  const getGradient = () => {
    if (isCombined) return "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"; // Deep Midnight
    if (isBank) return "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";     // Vivid Blue
    if (isCash) return "linear-gradient(135deg, #10b981 0%, #059669 100%)";     // Emerald Green
    return "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)";                // Purple
  };

  const getIcon = () => {
    if (isCombined) return "💎";
    if (isBank) return "🏛️";
    if (isCash) return "💵";
    return "💳";
  };

  return (
    <div
      style={{
        background: getGradient(),
        color: "#ffffff",
        padding: "24px",
        borderRadius: "20px",
        width: "320px",
        minWidth: "320px", // Ensures it stays wide in a flex row
        height: "190px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.3s ease",
        marginRight: "20px"
      }}
    >
      {/* Glossy Overlay effect */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
        borderRadius: "20px",
        pointerEvents: "none"
      }} />

      {/* Top Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "28px", opacity: 0.9 }}>{getIcon()}</div>
        <div style={{
          fontSize: "10px",
          fontWeight: "bold",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          backgroundColor: "rgba(255,255,255,0.15)",
          padding: "4px 10px",
          borderRadius: "6px"
        }}>
          {isCombined ? "Portfolio" : "Account"}
        </div>
      </div>

      {/* Center Section: Balance */}
      <div>
        <p style={{ margin: 0, fontSize: "12px", fontWeight: "300", opacity: 0.8 }}>Available Balance</p>
        <div style={{ fontSize: "26px", fontWeight: "700", marginTop: "4px" }}>
          {account.balance?.toLocaleString()} <span style={{ fontSize: "14px", fontWeight: "400", opacity: 0.7 }}>ETB</span>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <span style={{ fontSize: "15px", fontWeight: "600", letterSpacing: "0.5px" }}>{account.name}</span>
        <div style={{ opacity: 0.5, fontSize: "20px" }}>VISA</div>
      </div>
    </div>
  );
}

export default AccountSummary;