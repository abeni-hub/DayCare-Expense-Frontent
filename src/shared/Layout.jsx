import Navbar from "./Navbar";

function Layout({ currentView, onViewChange, children }) {
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
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
          backgroundColor: "#f8fafc", // Very light slate blue
          padding: "40px",
          position: "relative"
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