import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { ChartEmpty, ChartError, ChartLoading } from "./AnalyticsStates";

const STATUS_COLORS = {
  "To Do": "#94a3b8",
  "In Progress": "#2563eb",
  Review: "#f59e0b",
  Done: "#10b981",
};

export default function TaskCompletionRate({ data, loading, error }) {
  const chartData = data.statusData.filter((item) => item.value > 0);

  return (
    <Card className="min-h-[360px]">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Task Completion Rate</CardTitle>
          <CardDescription>Completed tasks compared with total scoped work.</CardDescription>
        </div>
        <CheckCircle2 size={22} className="text-emerald-500" />
      </CardHeader>

      <CardContent>
        {loading ? (
          <ChartLoading rows={5} />
        ) : error ? (
          <ChartError message={error} />
        ) : data.total === 0 ? (
          <ChartEmpty
            title="No tasks in scope"
            message="Completion rate will appear once tasks exist for the selected filters."
          />
        ) : (
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="flex flex-col justify-center rounded-2xl bg-gray-50 p-5">
              <p className="text-sm font-medium text-gray-500">Completion</p>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-5xl font-bold text-gray-900">{data.rate}%</span>
                <Badge variant="success" className="mb-1">
                  {data.completed}/{data.total} done
                </Badge>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                {data.pending} task{data.pending === 1 ? "" : "s"} still active.
              </p>
            </div>

            <div className="min-h-[220px]">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={86}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} tasks`, name]}
                    contentStyle={{
                      borderRadius: "12px",
                      borderColor: "#e5e7eb",
                      boxShadow: "0 10px 24px rgb(15 23 42 / 0.08)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2">
                {data.statusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs text-gray-500">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[item.name] }}
                    />
                    <span className="truncate">{item.name}</span>
                    <span className="ml-auto font-semibold text-gray-700">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
