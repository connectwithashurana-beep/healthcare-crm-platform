import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", visits: 25 },
  { month: "Feb", visits: 40 },
  { month: "Mar", visits: 32 },
  { month: "Apr", visits: 50 },
  { month: "May", visits: 45 },
  { month: "Jun", visits: 60 },
];

function BarChartComponent() {
  return (
    <div
      style={{
        width: "100%",
        height: 300,
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <h3>Monthly Visits</h3>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="visits" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartComponent;