import { useState } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import { useProjects } from "../context/ProjectsContext";
import { useBudget } from "../context/BudgetContext";
import BudgetOverview from "../components/budget/BudgetOverview";
import BudgetChart from "../components/budget/BudgetChart";
import BudgetSetupModal from "../components/budget/BudgetSetupModal";
import ExpenseLogModal from "../components/budget/ExpenseLogModal";
import ExpenseList from "../components/budget/ExpenseList";

export default function Budget() {
  const { workspaceId } = useWorkspace();
  const { projects } = useProjects();
  const { budgets, expenses } = useBudget();
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("all");

  const workspaceProjects = projects.filter((p) => p.workspaceId === workspaceId);
  const workspaceBudgets = budgets.filter((b) => b.workspaceId === workspaceId);
  const workspaceExpenses = expenses.filter((e) => e.workspaceId === workspaceId);

  const filteredProjectId = selectedProjectId === "all" ? null : selectedProjectId;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Budget Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track project budgets, log expenses, and monitor spend vs budget.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setSetupModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-medium"
          >
            Set Budget
          </button>
          <button
            onClick={() => setExpenseModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition text-sm font-medium"
          >
            Log Expense
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-600 font-medium">Filter by Project:</label>
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Projects</option>
          {workspaceProjects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <BudgetOverview
        projects={workspaceProjects}
        budgets={workspaceBudgets}
        expenses={workspaceExpenses}
        filterProjectId={filteredProjectId}
      />

      <BudgetChart
        projects={workspaceProjects}
        budgets={workspaceBudgets}
        expenses={workspaceExpenses}
        filterProjectId={filteredProjectId}
      />

      <ExpenseList
        projects={workspaceProjects}
        expenses={workspaceExpenses}
        filterProjectId={filteredProjectId}
      />

      {setupModalOpen && (
        <BudgetSetupModal
          projects={workspaceProjects}
          budgets={workspaceBudgets}
          onClose={() => setSetupModalOpen(false)}
        />
      )}
      {expenseModalOpen && (
        <ExpenseLogModal
          projects={workspaceProjects}
          onClose={() => setExpenseModalOpen(false)}
        />
      )}
    </div>
  );
}