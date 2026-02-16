import Navbar from "./Navbar";

function Layout({ currentView, onViewChange, children }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Navbar
        currentView={currentView}
        onViewChange={onViewChange}
      />

      <div
        style={{
          flex: 1,
          padding: "30px",
          backgroundColor: "#f4f6f9",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default Layout;
