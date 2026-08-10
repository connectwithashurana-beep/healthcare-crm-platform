import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>CRM AI</h2>

      <Link to="/dashboard">Dashboard</Link>
      <Link to="/customers">Customers</Link>
      <Link to="/interactions">Interactions</Link>
      <Link to="/reports">Reports</Link>
      <Link to="/settings">Settings</Link>
    </div>
  );
}

export default Sidebar;