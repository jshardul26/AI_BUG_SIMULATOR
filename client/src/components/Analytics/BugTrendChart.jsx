import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

const data = [
  { day: "Mon", bugs: 4 },
  { day: "Tue", bugs: 7 },
  { day: "Wed", bugs: 3 },
  { day: "Thu", bugs: 9 },
  { day: "Fri", bugs: 5 },
  { day: "Sat", bugs: 11 },
  { day: "Sun", bugs: 6 },
];

export default function BugTrendChart() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4">Bug Trends This Week</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="day" stroke="#71717a" tick={{ fill: "#71717a" }} />
          <YAxis stroke="#71717a" tick={{ fill: "#71717a" }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", color: "#fff" }}
          />
          <Line type="monotone" dataKey="bugs" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}