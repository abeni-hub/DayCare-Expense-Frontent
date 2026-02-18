import React from "react";

function AccountSummary({ account, isCombined }) {
  if (!account) return null;

  // Determine Icon and Theme based on account name
  const isBank = account.name.toLowerCase().includes("bank");
  const isCash = account.name.toLowerCase().includes("cash");

  const getCardStyle = () => {
    if (isCombined) {
      return {
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "#ffffff",
      };
    }
    return {
      background: "#ffffff",
      color: "#1e293b",
      border: "1px solid #e2e8f0",
    };
  };

  const getIcon = () => {
    if (isCombined) return "🌍";
    if (isBank) return "🏦";
    if (isCash) return "💵";
    return "💳";
  };

  return (
    <div
      style={{
        ...getCardStyle(),
        padding: "30px",
        borderRadius: "20px",
        width: "320px", // Made it wider
        boxShadow: isCombined
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s ease",
        cursor: "default"
      }}
    >
      {/* Decorative background circle for fancy look */}
      <div style={{
        position: "absolute",
        top: "-20px",
        right: "-20px",
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        background: isCombined ? "rgba(255,255,255,0.05)" : "rgba(59, 130, 246, 0.03)",
        zIndex: 0
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "20px" }}>
          <div style={{
            fontSize: "24px",
            background: isCombined ? "rgba(255,255,255,0.1)" : "#f1f5f9",
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px"
          }}>
            {getIcon()}
          </div>
          <span style={{
            fontSize: "12px",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "1px",
            opacity: 0.6
          }}>
            {isCombined ? "Primary Portfolio" : "Active Account"}
          </span>
        </div>

        <h3 style={{
          fontSize: "16px",
          fontWeight: "500",
          margin: "0 0 8px 0",
          opacity: isCombined ? 0.8 : 1
        }}>
          {account.name}
        </h3>

        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <span style={{ fontSize: "28px", fontWeight: "800" }}>
            {account.balance?.toLocaleString() ?? 0}
          </span>
          <span style={{ fontSize: "14px", fontWeight: "600", opacity: 0.6 }}>
            ETB
          </span>
        </div>

        <div style={{
          marginTop: "20px",
          paddingTop: "15px",
          borderTop: isCombined ? "1px solid rgba(255,255,255,0.1)" : "1px solid #f1f5f9",
          fontSize: "12px",
          display: "flex",
          justifyContent: "space-between"
        }}>
          <span>Status: <span style={{ color: isCombined ? "#10b981" : "#059669" }}>● Online</span></span>
          <span>Updated Just Now</span>
        </div>
      </div>
    </div>
  );
}

export default AccountSummary;