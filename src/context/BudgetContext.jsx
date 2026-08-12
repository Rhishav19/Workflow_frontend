import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const BudgetContext = createContext(null);

export function BudgetProvider({ children }) {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgets();
    fetchExpenses();

    const budgetChannel = supabase
      .channel("budgets-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "project_budgets" },
        () => fetchBudgets()
      )
      .subscribe();

    const expenseChannel = supabase
      .channel("expenses-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "expenses" },
        () => fetchExpenses()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(budgetChannel);
      supabase.removeChannel(expenseChannel);
    };
  }, []);

  async function fetchBudgets() {
    setLoading(true);
    const { data, error } = await supabase
      .from("project_budgets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching budgets:", error);
    } else {
      const mapped = data.map((b) => ({
        id: b.id,
        workspaceId: b.workspace_id,
        projectId: b.project_id,
        totalBudget: parseFloat(b.total_budget),
        currency: b.currency,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
      }));
      setBudgets(mapped);
    }
    setLoading(false);
  }

  async function fetchExpenses() {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching expenses:", error);
    } else {
      const mapped = data.map((e) => ({
        id: e.id,
        workspaceId: e.workspace_id,
        projectId: e.project_id,
        description: e.description,
        amount: parseFloat(e.amount),
        category: e.category,
        expenseDate: e.expense_date,
        createdBy: e.created_by,
        createdAt: e.created_at,
      }));
      setExpenses(mapped);
    }
  }

  async function setProjectBudget(budget) {
    const { error } = await supabase.from("project_budgets").upsert({
      id: budget.id,
      workspace_id: budget.workspaceId,
      project_id: budget.projectId,
      total_budget: budget.totalBudget,
      currency: budget.currency || "USD",
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error setting budget:", error);
      return { error };
    }

    setBudgets((prev) => {
      const exists = prev.find((b) => b.id === budget.id);
      if (exists) {
        return prev.map((b) => (b.id === budget.id ? { ...b, ...budget } : b));
      }
      return [budget, ...prev];
    });
    return { error: null };
  }

  async function addExpense(expense) {
    const { error } = await supabase.from("expenses").insert({
      id: expense.id,
      workspace_id: expense.workspaceId,
      project_id: expense.projectId,
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      expense_date: expense.expenseDate,
      created_by: expense.createdBy,
    });

    if (error) {
      console.error("Error adding expense:", error);
      return { error };
    }

    setExpenses((prev) => [expense, ...prev]);
    return { error: null };
  }

  async function deleteExpense(expenseId) {
    const { error } = await supabase.from("expenses").delete().eq("id", expenseId);

    if (error) {
      console.error("Error deleting expense:", error);
      return { error };
    }

    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
    return { error: null };
  }

  function getProjectBudget(projectId) {
    return budgets.find((b) => b.projectId === projectId);
  }

  function getProjectExpenses(projectId) {
    return expenses.filter((e) => e.projectId === projectId);
  }

  function getTotalSpent(projectId) {
    return getProjectExpenses(projectId).reduce((sum, e) => sum + e.amount, 0);
  }

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        expenses,
        loading,
        setProjectBudget,
        addExpense,
        deleteExpense,
        getProjectBudget,
        getProjectExpenses,
        getTotalSpent,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
}