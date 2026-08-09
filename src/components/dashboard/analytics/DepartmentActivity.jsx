import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Building2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { ChartEmpty, ChartError, ChartLoading } from "./AnalyticsStates";

export default function DepartmentActivity({ data, loading, error }) {
  return (
    <Card className="min-h-[420px]">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Department Activity</CardTitle>
          <CardDescription>Tasks, time, projects, and team activity by department.</CardDescription>
        </div>
        <Building2 size={22} className="text-indigo-500" />
      </CardHeader>

      <CardContent>
        {loading ? (
          <ChartLoading rows={7} />
        ) : error ? (
          <ChartError message={error} />
        ) : data.length === 0 ? (
          <ChartEmpty
            title="No department activity"
            message="Activity appears once projects, members, tasks, or time entries have departments."
          />
        ) : (
          <div className="space-y-5">
            <div className="min-h-[300px]">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.slice(0, 8)} margin={{ top: 10, right: 8, left: -18, bottom: 16 }}>
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
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<DepartmentTooltip />} cursor={{ fill: "#f8fafc" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                  <Bar
                    dataKey="tasksCreated"
                    name="Created"
                    stackId="tasks"
                    fill="#2563eb"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="tasksCompleted"
                    name="Completed"
                    stackId="tasks"
                    fill="#10b981"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="loggedHours"
                    name="Hours"
                    fill="#f97316"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <div className="min-w-[520px]">
                <div className="grid grid-cols-[1.2fr_repeat(4,minmax(58px,0.7fr))] bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <span>Department</span>
                  <span className="text-right">Created</span>
                  <span className="text-right">Done</span>
                  <span className="text-right">Hours</span>
                  <span className="text-right">Team</span>
                </div>
                {data.slice(0, 5).map((department) => (
                  <div
                    key={department.name}
                    className="grid grid-cols-[1.2fr_repeat(4,minmax(58px,0.7fr))] border-t border-gray-100 px-4 py-3 text-sm"
                  >
                    <span className="truncate font-semibold text-gray-800">
                      {department.name}
                    </span>
                    <span className="text-right text-gray-600">
                      {department.tasksCreated}
                    </span>
                    <span className="text-right text-gray-600">
                      {department.tasksCompleted}
                    </span>
                    <span className="text-right text-gray-600">
                      {department.loggedHours}
                    </span>
                    <span className="text-right text-gray-600">
                      {department.members}
                    </span>
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

function DepartmentTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const department = payload[0].payload;
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-gray-900">{label}</p>
      <p className="text-gray-500">Tasks created: {department.tasksCreated}</p>
      <p className="text-gray-500">Tasks completed: {department.tasksCompleted}</p>
      <p className="text-gray-500">Hours logged: {department.loggedHours}h</p>
      <p className="text-gray-500">Members: {department.members}</p>
      <p className="text-gray-500">Projects: {department.projects}</p>
    </div>
  );
}
