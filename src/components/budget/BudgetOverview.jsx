import { useMemo } from "react";
import { Banknote, Receipt, PiggyBank, TrendingUp } from "lucide-react"; 

const BudgetOverview = ({ projects, budgets, expenses, filterProjectId }) => {
  const stats = useMemo(() => {
    const relevantProjects = filterProjectId
      ? projects.filter((p) => p.id === filterProjectId)
      : projects;

    const relevantBudgets = filterProjectId
      ? budgets.filter((b) => b.projectId === filterProjectId)
      : budgets;

    const relevantExpenses = filterProjectId
      ? expenses.filter((e) => e.projectId === filterProjectId)
      : expenses;

    const totalBudget = relevantBudgets.reduce((sum, b) => sum + b.totalBudget, 0);
    const totalSpent = relevantExpenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = totalBudget - totalSpent;
    const utilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return {
      totalBudget,
      totalSpent,
      remaining,
      utilization: utilization.toFixed(1),
      projectCount: relevantProjects.length,
    };
  }, [projects, budgets, expenses, filterProjectId]);

  const cards = [
    {
      title: "Total Budget",
      value: `Rs. ${stats.totalBudget.toLocaleString()}`,
      icon: <Banknote className="w-5 h-5 text-blue-600" />,  // <-- changed
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Spent",
      value: `Rs. ${stats.totalSpent.toLocaleString()}`,
      icon: <Receipt className="w-5 h-5 text-rose-600" />,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      title: "Remaining",
      value: `Rs. ${stats.remaining.toLocaleString()}`,
      icon: <PiggyBank className="w-5 h-5 text-emerald-600" />,
      color: stats.remaining < 0 ? "text-red-600" : "text-emerald-600",
      bg: stats.remaining < 0 ? "bg-red-50" : "bg-emerald-50",
    },
    {
      title: "Utilization",
      value: `${stats.utilization}%`,
      icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
      color: parseFloat(stats.utilization) > 90 ? "text-red-600" : "text-amber-600",
      bg: parseFloat(stats.utilization) > 90 ? "bg-red-50" : "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-sm font-medium">{card.title}</p>
            <div className={`p-2 rounded-lg ${card.bg}`}>{card.icon}</div>
          </div>
          <h2 className={`text-3xl font-bold ${card.color}`}>{card.value}</h2>
        </div>
      ))}
    </div>
  );
};

export default BudgetOverview;