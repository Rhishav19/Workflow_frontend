import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { WalletCards } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { ChartEmpty, ChartError, ChartLoading } from "./AnalyticsStates";
import { formatCurrency } from "../../../utils/analytics";

const COLORS = ["#2563eb", "#10b981", "#f97316", "#7c3aed", "#14b8a6", "#e11d48"];

export default function SpendingBreakdown({ data, loading, error }) {
  const categoryData = data.byCategory.slice(0, 6);
  const departmentData = data.byDepartment.slice(0, 6);

  return (
    <Card className="min-h-[420px]">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Spending Breakdown</CardTitle>
          <CardDescription>Budget usage split by category and department.</CardDescription>
        </div>
        <WalletCards size={22} className="text-violet-500" />
      </CardHeader>

      <CardContent>
        {loading ? (
          <ChartLoading rows={7} />
        ) : error ? (
          <ChartError message={error} />
        ) : data.total === 0 ? (
          <ChartEmpty
            title="No spending entries"
            message="Add rows to spending_entries to see budget usage by category and department."
          />
        ) : (
          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col">
              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm font-medium text-gray-500">Total spend</p>
                <p className="mt-2 text-4xl font-bold text-gray-900">
                  {formatCurrency(data.total)}
                </p>
                <Badge variant="info" className="mt-3">
                  {categoryData.length} categories
                </Badge>
              </div>

              <div className="mt-4 min-h-[220px]">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={54}
                      outerRadius={84}
                      paddingAngle={3}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [formatCurrency(value), name]}
                      contentStyle={{
                        borderRadius: "12px",
                        borderColor: "#e5e7eb",
                        boxShadow: "0 10px 24px rgb(15 23 42 / 0.08)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-5">
              <div className="min-h-[260px]">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={departmentData}
                    layout="vertical"
                    margin={{ top: 6, right: 20, left: 20, bottom: 6 }}
                  >
                    <XAxis
                      type="number"
                      tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={118}
                      tick={{ fill: "#334155", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<SpendingTooltip />} cursor={{ fill: "#f8fafc" }} />
                    <Bar dataKey="value" name="Spend" radius={[0, 8, 8, 0]}>
                      {departmentData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {categoryData.map((category, index) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="truncate text-sm font-semibold text-gray-800">
                        {category.name}
                      </span>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-gray-900">
                      {formatCurrency(category.value)}
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

function SpendingTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-gray-900">{label}</p>
      <p className="text-gray-500">Spend: {formatCurrency(payload[0].value)}</p>
    </div>
  );
}
