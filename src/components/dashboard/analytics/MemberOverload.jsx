import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { UsersRound } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { ChartEmpty, ChartError, ChartLoading } from "./AnalyticsStates";

export default function MemberOverload({
  data,
  loading,
  error,
  threshold,
  onThresholdChange,
}) {
  const hasData = data.members.length > 0;
  const chartHeight = Math.max(230, data.members.length * 48);

  return (
    <Card className="min-h-[390px]">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Member Overload</CardTitle>
          <CardDescription>Open assignments and logged hours against healthy limits.</CardDescription>
        </div>
        <UsersRound size={22} className="text-blue-500" />
      </CardHeader>

      <CardContent>
        {loading ? (
          <ChartLoading rows={6} />
        ) : error ? (
          <ChartError message={error} />
        ) : !hasData ? (
          <ChartEmpty
            title="No member workload in scope"
            message="Assigned tasks or completed time entries will populate this chart."
          />
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant={data.overloadedCount > 0 ? "danger" : "success"}>
                  {data.overloadedCount} overloaded
                </Badge>
                <Badge variant="info">{data.healthyHours}h healthy time limit</Badge>
              </div>

              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                Task limit
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={threshold}
                  onChange={(event) => onThresholdChange(event.target.value)}
                  className="h-9 w-16 rounded-lg border border-gray-200 px-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                />
              </label>
            </div>

            <div className="min-h-[230px]">
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart
                  data={data.members}
                  layout="vertical"
                  margin={{ top: 6, right: 18, left: 8, bottom: 6 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eef2f7" />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={112}
                    tick={{ fill: "#334155", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<WorkloadTooltip />} cursor={{ fill: "#f8fafc" }} />
                  <ReferenceLine
                    x={data.taskThreshold}
                    stroke="#f97316"
                    strokeDasharray="4 4"
                  />
                  <Bar dataKey="openTasks" name="Open tasks" radius={[0, 8, 8, 0]}>
                    {data.members.map((member) => (
                      <Cell
                        key={member.id}
                        fill={member.overloaded ? "#ef4444" : "#14b8a6"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {data.members.slice(0, 4).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-400">{member.department}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-gray-900">{member.openTasks}</p>
                    <p className="text-xs text-gray-400">{member.loggedHours}h</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function WorkloadTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const member = payload[0].payload;
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-gray-900">{member.name}</p>
      <p className="text-gray-500">Open tasks: {member.openTasks}</p>
      <p className="text-gray-500">Logged hours: {member.loggedHours}h</p>
      {member.overloaded && (
        <p className="mt-1 text-xs font-semibold text-red-600">Above healthy limit</p>
      )}
    </div>
  );
}
