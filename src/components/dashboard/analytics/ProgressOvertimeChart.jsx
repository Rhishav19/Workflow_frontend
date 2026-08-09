import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { ChartEmpty, ChartError, ChartLoading } from "./AnalyticsStates";

export default function ProgressOvertimeChart({ data, loading, error }) {
  return (
    <Card className="min-h-[390px]">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Progress vs Overtime</CardTitle>
          <CardDescription>Project progress compared with overtime logged.</CardDescription>
        </div>
        <Activity size={22} className="text-amber-500" />
      </CardHeader>

      <CardContent>
        {loading ? (
          <ChartLoading rows={6} />
        ) : error ? (
          <ChartError message={error} />
        ) : data.length === 0 ? (
          <ChartEmpty
            title="No projects in scope"
            message="Projects and completed time entries will reveal overtime patterns."
          />
        ) : (
          <div className="min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={data} margin={{ top: 10, right: 12, left: -16, bottom: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={56}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="progress"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="overtime"
                  orientation="right"
                  tickFormatter={(value) => `${value}h`}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ProgressTooltip />} cursor={{ fill: "#f8fafc" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                <Bar
                  yAxisId="progress"
                  dataKey="progress"
                  name="Progress"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                />
                <Line
                  yAxisId="overtime"
                  type="monotone"
                  dataKey="overtimeHours"
                  name="Overtime"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#f97316" }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProgressTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const progress = payload.find((item) => item.dataKey === "progress")?.value ?? 0;
  const overtime = payload.find((item) => item.dataKey === "overtimeHours")?.value ?? 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-gray-900">{label}</p>
      <p className="text-gray-500">Progress: {progress}%</p>
      <p className="text-gray-500">Overtime: {overtime}h</p>
    </div>
  );
}
