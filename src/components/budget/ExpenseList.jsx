import { useMemo } from "react";
import { Trash2, Calendar, User, Tag } from "lucide-react";
import { useBudget } from "../../context/BudgetContext";

const ExpenseList = ({ projects, expenses, filterProjectId }) => {
  const { deleteExpense } = useBudget();

  const filteredExpenses = useMemo(() => {
    const list = filterProjectId
      ? expenses.filter((e) => e.projectId === filterProjectId)
      : expenses;
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [expenses, filterProjectId]);

  function getProjectName(projectId) {
    return projects.find((p) => p.id === projectId)?.name || "Unknown";
  }

  const categoryColors = {
    General: "bg-gray-100 text-gray-700",
    Software: "bg-blue-100 text-blue-700",
    Hardware: "bg-indigo-100 text-indigo-700",
    Marketing: "bg-pink-100 text-pink-700",
    Travel: "bg-cyan-100 text-cyan-700",
    Salaries: "bg-violet-100 text-violet-700",
    Utilities: "bg-orange-100 text-orange-700",
    Consulting: "bg-teal-100 text-teal-700",
    Other: "bg-slate-100 text-slate-700",
  };

  if (filteredExpenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 text-center">
        <p className="text-gray-500">No expenses logged yet.</p>
        <p className="text-gray-400 text-sm mt-1">
          Click "Log Expense" to record your first expense.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-800">Recent Expenses</h3>
        <p className="text-gray-500 text-sm">
          {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? "s" : ""} recorded
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {filteredExpenses.map((expense) => (
          <div
            key={expense.id}
            className="p-4 hover:bg-gray-50 transition flex items-center justify-between group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-800 truncate">
                  {expense.description}
                </h4>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    categoryColors[expense.category] || categoryColors.Other
                  }`}
                >
                  {expense.category}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {expense.expenseDate}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {expense.createdBy}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {getProjectName(expense.projectId)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-4">
              <span className="text-lg font-bold text-gray-800">
                ${expense.amount.toLocaleString()}
              </span>
              <button
                onClick={() => deleteExpense(expense.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                title="Delete expense"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;