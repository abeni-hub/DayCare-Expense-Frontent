import Navbar from "./Navbar";

function Layout({ currentView, onViewChange, children }) {
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100%", // Changed from 100vw to 100% to stop side-to-side shifting
      overflow: "hidden",
      margin: 0,    // Added to ensure no outer gaps
      padding: 0,   // Added to ensure no outer gaps
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      {/* Sidebar - Fixed Width */}
      <Navbar
        currentView={currentView}
        onViewChange={onViewChange}
      />

      {/* Main Content Area - Scrollable */}
      <div
        style={{
          flex: 1,
          height: "100vh",
          overflowY: "auto",
          backgroundColor: "#f8fafc",
          padding: "40px",
          position: "relative",
          boxSizing: "border-box" // Ensures padding doesn't push width out
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;