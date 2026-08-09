import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useBudget } from "../../context/BudgetContext";
import { useWorkspace } from "../../context/WorkspaceContext";

const BudgetSetupModal = ({ projects, budgets, onClose }) => {
  const { workspaceId } = useWorkspace();
  const { setProjectBudget } = useBudget();
  const [projectId, setProjectId] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedProject = projects.find((p) => p.id === projectId);
  const existingBudget = budgets.find((b) => b.projectId === projectId);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!projectId || !amount) return;

    setSaving(true);
    await setProjectBudget({
      id: existingBudget?.id || crypto.randomUUID(),
      workspaceId,
      projectId,
      totalBudget: parseFloat(amount),
      currency: "NRP",
    });
    setSaving(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-1">
          {existingBudget ? "Update Budget" : "Set Project Budget"}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {existingBudget
            ? "Update the budget for the selected project."
            : "Assign a budget to a project to start tracking expenses."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {selectedProject && existingBudget && (
            <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-lg">
              Current budget: <strong>Rs. {existingBudget.totalBudget.toLocaleString()}</strong>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget Amount
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium">
              NRP (Rs.)
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            {saving ? "Saving..." : existingBudget ? "Update Budget" : "Set Budget"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BudgetSetupModal;