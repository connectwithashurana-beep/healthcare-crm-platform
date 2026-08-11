import { useEffect, useState } from "react";
import BarChartComponent from "../../components/Charts/BarChartComponent";
import PieChartComponent from "../../components/Charts/PieChartComponent";
import Layout from "../../components/Layout/Layout";
import { fetchCustomers } from "../../services/customerService";
import "./Dashboard.css";

function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch customers from backend
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const responseData = await fetchCustomers();

        const data = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData?.results)
          ? responseData.results
          : Array.isArray(responseData?.data)
          ? responseData.data
          : Array.isArray(responseData?.data?.results)
          ? responseData.data.results
          : [];

        console.log("Dashboard customers:", data);

        setCustomers(data);
      } catch (error) {
        console.error("Dashboard customer fetch error:", error);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  // Customer counts
  const totalCustomers = customers.length;

  const leadCount = customers.filter(
    (customer) =>
      String(customer.status || "").toLowerCase() === "lead"
  ).length;

  const customerCount = customers.filter(
    (customer) =>
      String(customer.status || "").toLowerCase() === "customer"
  ).length;

  const inactiveCount = customers.filter(
    (customer) =>
      String(customer.status || "").toLowerCase() === "inactive"
  ).length;

  const stats = [
    {
      title: "Total Customers",
      value: loading ? "..." : totalCustomers,
    },
    {
      title: "Leads",
      value: loading ? "..." : leadCount,
    },
    {
      title: "Customers",
      value: loading ? "..." : customerCount,
    },
    {
      title: "Inactive",
      value: loading ? "..." : inactiveCount,
    },
  ];

  // Show latest customers as recent activities
  const recentCustomers = [...customers]
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <Layout>
      <h1>Dashboard</h1>

      {/* Dashboard Cards */}
      <div className="dashboard-cards">
        {stats.map((item, index) => (
          <div className="card" key={index}>
            <h2>{item.value}</h2>
            <p>{item.title}</p>
          </div>
        ))}
      </div>

      {/* Recent Customers */}
      <h2 className="recent-title">Recent Customers</h2>

      <table className="activity-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Company</th>
            <th>City</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {recentCustomers.length > 0 ? (
            recentCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  {customer.first_name} {customer.last_name}
                </td>
                <td>{customer.company || "-"}</td>
                <td>{customer.city || "-"}</td>
                <td>{customer.status || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">
                {loading ? "Loading customers..." : "No customers found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Charts */}
      <div className="charts-container">
        <div className="chart-box">
          <BarChartComponent />
        </div>

        <div className="chart-box">
          <PieChartComponent />
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;