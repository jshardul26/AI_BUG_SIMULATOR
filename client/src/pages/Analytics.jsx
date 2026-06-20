import MetricsCard from "../components/Analytics/MetricsCard";
import BugTrendChart from "../components/Analytics/BugTrendChart";
import SeverityChart from "../components/Analytics/SeverityChart";

const metrics = [
  {
    title: "Total Bugs Analyzed",
    value: "1,284",
    subtitle: "+12% from last week",
    icon: "🐛",
    color: "violet",
  },
  {
    title: "Critical Issues",
    value: "38",
    subtitle: "Needs immediate attention",
    icon: "🔴",
    color: "red",
  },
  {
    title: "Bugs Resolved",
    value: "947",
    subtitle: "73% resolution rate",
    icon: "✅",
    color: "green",
  },
  {
    title: "Avg Fix Time",
    value: "2.4h",
    subtitle: "Down from 3.1h last week",
    icon: "⚡",
    color: "blue",
  },
];

export default function Analytics() {
  return (
    <div className="p-6 text-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-zinc-400 mt-1">
          Track bug trends, severity distribution and team performance.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <MetricsCard key={m.title} {...m} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BugTrendChart />
        <SeverityChart />
      </div>
    </div>
  );
}