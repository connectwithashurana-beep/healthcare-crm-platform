import BarChartComponent from "../../components/Charts/BarChartComponent";
import PieChartComponent from "../../components/Charts/PieChartComponent";
import Layout from "../../components/Layout/Layout";
import "./Dashboard.css";

function Dashboard() {
  const stats = [
    {
      title: "Total Customers",
      value: 120,
    },
    {
      title: "Today's Visits",
      value: 18,
    },
    {
      title: "Interactions",
      value: 350,
    },
    {
      title: "Pending Follow-ups",
      value: 22,
    },
  ];

  const activities = [
    {
      id: 1,
      customer: "Dr. Rajesh Sharma",
      interaction: "Product Demo",
      date: "29 Jul 2026",
      status: "Completed",
    },
    {
      id: 2,
      customer: "Dr. Priya Mehta",
      interaction: "Phone Call",
      date: "30 Jul 2026",
      status: "Pending",
    },
    {
      id: 3,
      customer: "Dr. Amit Verma",
      interaction: "Meeting",
      date: "30 Jul 2026",
      status: "Completed",
    },
  ];

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

      {/* Recent Activities */}
      <h2 className="recent-title">Recent Activities</h2>

      <table className="activity-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Interaction</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id}>
              <td>{activity.customer}</td>
              <td>{activity.interaction}</td>
              <td>{activity.date}</td>
              <td>{activity.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
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