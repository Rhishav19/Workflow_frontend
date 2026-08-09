import { create } from "zustand";
import { supabase } from "../lib/supabaseClient";

export const TIME_RANGES = [
  { value: "all", label: "All time", days: null },
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "90d", label: "Last 90 days", days: 90 },
];

export const useAnalyticsStore = create((set, get) => ({
  department: "All",
  timeRange: "30d",
  workloadTaskThreshold: 5,
  spending: [],
  spendingLoading: false,
  spendingError: null,

  setDepartment: (department) => set({ department }),
  setTimeRange: (timeRange) => set({ timeRange }),
  setWorkloadTaskThreshold: (workloadTaskThreshold) =>
    set({ workloadTaskThreshold: Number(workloadTaskThreshold) || 1 }),

  fetchSpending: async (workspaceId) => {
    if (!workspaceId) {
      set({ spending: [], spendingLoading: false, spendingError: null });
      return;
    }

    const currentWorkspaceId = get().spendingWorkspaceId;
    if (currentWorkspaceId === workspaceId && get().spending.length > 0) return;

    set({
      spendingLoading: true,
      spendingError: null,
      spendingWorkspaceId: workspaceId,
    });

    const { data, error } = await supabase
      .from("spending_entries")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("spent_at", { ascending: false });

    if (error) {
      set({
        spending: [],
        spendingLoading: false,
        spendingError: error.message,
      });
      return;
    }

    set({
      spending: data.map((row) => ({
        id: row.id,
        workspaceId: row.workspace_id,
        projectId: row.project_id,
        department: row.department,
        category: row.category,
        amount: Number(row.amount ?? 0),
        spentAt: row.spent_at,
        note: row.note,
        createdAt: row.created_at,
      })),
      spendingLoading: false,
      spendingError: null,
    });
  },
}));
