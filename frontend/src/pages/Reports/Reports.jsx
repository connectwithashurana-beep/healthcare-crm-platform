import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { fetchCustomers } from "../../services/customerService";
import "./Reports.css";

function Reports() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

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

        console.log("Reports customers:", data);

        setCustomers(data);
      } catch (error) {
        console.error("Reports API error:", error);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const totalCustomers = customers.length;

  const totalLeads = customers.filter(
    (customer) =>
      String(customer.status || "").toLowerCase() === "lead"
  ).length;

  const totalActiveCustomers = customers.filter(
    (customer) =>
      String(customer.status || "").toLowerCase() === "customer"
  ).length;

  const totalInactive = customers.filter(
    (customer) =>
      String(customer.status || "").toLowerCase() === "inactive"
  ).length;

  return (
    <Layout>
      <h1>Reports</h1>

      {/* Summary Cards */}
      <div className="dashboard-cards">
        <div className="card">
          <h2>{loading ? "..." : totalCustomers}</h2>
          <p>Total Customers</p>
        </div>

        <div className="card">
          <h2>{loading ? "..." : totalLeads}</h2>
          <p>Total Leads</p>
        </div>

        <div className="card">
          <h2>{loading ? "..." : totalActiveCustomers}</h2>
          <p>Active Customers</p>
        </div>

        <div className="card">
          <h2>{loading ? "..." : totalInactive}</h2>
          <p>Inactive Customers</p>
        </div>
      </div>

      {/* Customer Report */}
      <h2 className="recent-title">Customer Report</h2>

      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Email</th>
            <th>City</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  {customer.first_name} {customer.last_name}
                </td>

                <td>{customer.email || "-"}</td>

                <td>{customer.city || "-"}</td>

                <td>{customer.status || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">
                {loading
                  ? "Loading report..."
                  : "No customer data available"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Layout>
  );
}

export default Reports;