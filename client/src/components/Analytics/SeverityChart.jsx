import {
  PieChart, Pie, Cell,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

const data = [
  { name: "Critical", value: 8 },
  { name: "High", value: 15 },
  { name: "Medium", value: 22 },
  { name: "Low", value: 31 },
];

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e"];

export default function SeverityChart() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4">Severity Distribution</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", color: "#fff" }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#a1a1aa" }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}