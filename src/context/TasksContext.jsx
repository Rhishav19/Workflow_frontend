import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { createNotification } from "../data/notificationsApi";

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      const mapped = data.map((t) => ({
        id: t.id,
        workspaceId: t.workspace_id,
        projectId: t.project_id,
        title: t.title,
        priority: t.priority,
        assignee: t.assignee,
        dueDate: t.due_date,
        status: t.status,
        submission: t.submission,
      }));
      setTasks(mapped);
    }
    setLoading(false);
  }

  async function addTask(task) {
    const { error } = await supabase.from("tasks").insert({
      id: task.id,
      workspace_id: task.workspaceId,
      project_id: task.projectId,
      title: task.title,
      priority: task.priority,
      assignee: task.assignee,
      due_date: task.dueDate,
      status: task.status,
    });

    if (error) {
      console.error("Error creating task:", error);
      return;
    }

    setTasks((prev) => [task, ...prev]);

    createNotification({
      workspaceId: task.workspaceId,
      type: "task_assigned",
      message: `You were assigned a new task: "${task.title}"`,
      targetInitials: task.assignee,
    });
  }

  async function updateTask(taskId, updates) {
    const dbUpdates = {};
    if ("status" in updates) dbUpdates.status = updates.status;
    if ("priority" in updates) dbUpdates.priority = updates.priority;
    if ("submission" in updates) dbUpdates.submission = updates.submission;

    const { error } = await supabase
      .from("tasks")
      .update(dbUpdates)
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task:", error);
      return;
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
  }

  function moveTask(taskId, newStatus) {
    const task = tasks.find((t) => t.id === taskId);
    updateTask(taskId, { status: newStatus });

    if (task && task.status !== newStatus) {
      createNotification({
        workspaceId: task.workspaceId,
        type: "task_moved",
        message: `"${task.title}" moved to ${newStatus}`,
        targetInitials: task.assignee,
      });
    }
  }

  function changePriority(taskId, newPriority) {
    updateTask(taskId, { priority: newPriority });
  }

  function submitTask(taskId, submission) {
    const task = tasks.find((t) => t.id === taskId);
    updateTask(taskId, { status: "Review", submission });

    if (task) {
      createNotification({
        workspaceId: task.workspaceId,
        type: "task_submitted",
        message: `${task.assignee} submitted "${task.title}" for review`,
        targetRoles: ["Admin", "Manager"],
      });
    }
  }

  function approveTask(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    updateTask(taskId, { status: "Done" });

    if (task) {
      createNotification({
        workspaceId: task.workspaceId,
        type: "task_approved",
        message: `Your task "${task.title}" was approved`,
        targetInitials: task.assignee,
      });
    }
  }

  function requestChanges(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    updateTask(taskId, { status: "In Progress", submission: null });

    if (task) {
      createNotification({
        workspaceId: task.workspaceId,
        type: "task_changes",
        message: `Changes requested on "${task.title}"`,
        targetInitials: task.assignee,
      });
    }
  }

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        updateTask,
        moveTask,
        changePriority,
        submitTask,
        approveTask,
        requestChanges,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}