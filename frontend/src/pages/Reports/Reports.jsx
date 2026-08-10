import Layout from "../../components/Layout/Layout";
import "./Reports.css";

function Reports() {
  const reportData = [
    {
      id: 1,
      doctor: "Dr. Rajesh Sharma",
      interactions: 12,
      followUps: 5,
    },
    {
      id: 2,
      doctor: "Dr. Priya Mehta",
      interactions: 9,
      followUps: 3,
    },
    {
      id: 3,
      doctor: "Dr. Amit Verma",
      interactions: 15,
      followUps: 6,
    },
  ];

  return (
    <Layout>
      <h1>Reports</h1>

      <table>
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Total Interactions</th>
            <th>Follow-ups</th>
          </tr>
        </thead>

        <tbody>
          {reportData.map((report) => (
            <tr key={report.id}>
              <td>{report.doctor}</td>
              <td>{report.interactions}</td>
              <td>{report.followUps}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default Reports;