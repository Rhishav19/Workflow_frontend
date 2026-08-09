import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";
import { useTasks } from "./TasksContext";

const TimeTrackingContext = createContext(null);

export function TimeTrackingProvider({ children }) {
  const { user } = useAuth();
  const { updateTask } = useTasks();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEntries = useCallback(async function fetchEntries() {
    setLoading(true);
    const { data, error } = await supabase
      .from("time_entries")
      .select("*")
      .order("start_time", { ascending: false });

    if (error) {
      console.error("Error fetching time entries:", error);
      setError(error.message);
    } else {
      const mapped = data.map((e) => ({
        id: e.id,
        workspaceId: e.workspace_id,
        taskId: e.task_id,
        projectId: e.project_id,
        userEmail: e.user_email,
        userName: e.user_name,
        startTime: e.start_time,
        endTime: e.end_time,
        durationSeconds: e.duration_seconds,
        createdAt: e.created_at,
      }));
      setEntries(mapped);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEntries();

    const channel = supabase
      .channel("time-entries-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "time_entries" },
        () => {
          fetchEntries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEntries]);

  // Starts a timer for a task. Refuses if the current user already has a
  // running timer (on this task or any other) so entries never overlap.
  async function startTimer({ workspaceId, taskId, projectId }) {
    if (!user?.email) return;

    const alreadyRunning = entries.find(
      (e) => e.userEmail === user.email && e.endTime === null
    );
    if (alreadyRunning) return;

    const newEntry = {
      id: `entry-${Date.now()}`,
      workspace_id: workspaceId,
      task_id: taskId,
      project_id: projectId,
      user_email: user.email,
      user_name: user.name,
      start_time: new Date().toISOString(),
      end_time: null,
      duration_seconds: null,
    };

    const { error } = await supabase.from("time_entries").insert(newEntry);

    if (error) {
      console.error("Error starting timer:", error);
      return;
    }

    setEntries((prev) => [
      {
        id: newEntry.id,
        workspaceId,
        taskId,
        projectId,
        userEmail: user.email,
        userName: user.name,
        startTime: newEntry.start_time,
        endTime: null,
        durationSeconds: null,
        createdAt: newEntry.start_time,
      },
      ...prev,
    ]);

    // Starting a timer always moves the task to "In Progress" — unconditionally,
    // even if it was already "Review" or "Done". Stopping the timer does NOT
    // move it back, since the work might just be paused, not finished.
    updateTask(taskId, { status: "In Progress" });
  }

  async function stopTimer(entryId) {
    const entry = entries.find((e) => e.id === entryId);
    if (!entry) return;

    const endTime = new Date();
    const durationSeconds = Math.round(
      (endTime.getTime() - new Date(entry.startTime).getTime()) / 1000
    );

    const { error } = await supabase
      .from("time_entries")
      .update({ end_time: endTime.toISOString(), duration_seconds: durationSeconds })
      .eq("id", entryId);

    if (error) {
      console.error("Error stopping timer:", error);
      return;
    }

    setEntries((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? { ...e, endTime: endTime.toISOString(), durationSeconds }
          : e
      )
    );
  }

  // The current user's running entry, if any — at most one at a time.
  function getActiveEntry() {
    if (!user?.email) return null;
    return entries.find((e) => e.userEmail === user.email && e.endTime === null) ?? null;
  }

  function getTotalSecondsForTask(taskId) {
    return entries
      .filter((e) => e.taskId === taskId && e.durationSeconds != null)
      .reduce((sum, e) => sum + e.durationSeconds, 0);
  }

  function getTotalSecondsForProject(projectId) {
    return entries
      .filter((e) => e.projectId === projectId && e.durationSeconds != null)
      .reduce((sum, e) => sum + e.durationSeconds, 0);
  }

  return (
    <TimeTrackingContext.Provider
      value={{
        entries,
        loading,
        startTimer,
        stopTimer,
        getActiveEntry,
        getTotalSecondsForTask,
        getTotalSecondsForProject,
        error,
      }}
    >
      {children}
    </TimeTrackingContext.Provider>
  );
}

export function useTimeTracking() {
  const context = useContext(TimeTrackingContext);
  if (!context) {
    throw new Error("useTimeTracking must be used within a TimeTrackingProvider");
  }
  return context;
}
