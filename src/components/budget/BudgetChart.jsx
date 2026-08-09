import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const BudgetChart = ({ projects, budgets, expenses, filterProjectId }) => {
  const data = useMemo(() => {
    const relevantProjects = filterProjectId
      ? projects.filter((p) => p.id === filterProjectId)
      : projects;

    return relevantProjects.map((project) => {
      const budget = budgets.find((b) => b.projectId === project.id);
      const projectExpenses = expenses.filter((e) => e.projectId === project.id);
      const spent = projectExpenses.reduce((sum, e) => sum + e.amount, 0);
      const totalBudget = budget?.totalBudget || 0;
      const remaining = totalBudget - spent;

      return {
        name: project.name,
        budget: totalBudget,
        spent: spent,
        remaining: remaining > 0 ? remaining : 0,
        overBudget: remaining < 0 ? Math.abs(remaining) : 0,
      };
    });
  }, [projects, budgets, expenses, filterProjectId]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry) => (
            <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: Rs. {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 text-center">
        <p className="text-gray-500">No project data available for chart.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Spend vs Budget</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `Rs. ${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="budget" name="Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="spent" name="Spent" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="remaining" name="Remaining" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="overBudget" name="Over Budget" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetChart;