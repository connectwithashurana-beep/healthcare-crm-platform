import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Meeting", value: 45 },
  { name: "Call", value: 30 },
  { name: "Email", value: 25 },
];

const COLORS = ["#2563eb", "#10b981", "#f59e0b"];

function PieChartComponent() {
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
      <h3>Interaction Types</h3>

      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={90}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartComponent;