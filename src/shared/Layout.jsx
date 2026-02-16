import Navbar from "./Navbar";

function Layout({ currentView, onViewChange, children }) {
  return (
    <div>
      <Navbar currentView={currentView} onViewChange={onViewChange} />

      <div style={{ padding: "20px" }}>
        {children}
      </div>
    </div>
  );
}

export default Layout;
