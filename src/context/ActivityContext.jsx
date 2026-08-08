import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ActivityContext = createContext(null);

export function ActivityProvider({ children }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();

    const channel = supabase
      .channel("activity-log-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "activity_log" },
        () => {
          fetchActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchActivities() {
    setLoading(true);
    const { data, error } = await supabase
      .from("activity_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching activity log:", error);
    } else {
      const mapped = data.map((a) => ({
        id: a.id,
        workspaceId: a.workspace_id,
        actor: a.actor,
        verb: a.verb,
        target: a.target,
        createdAt: a.created_at,
      }));
      setActivities(mapped);
    }
    setLoading(false);
  }

  async function logActivity({ workspaceId, actor, verb, target }) {
    const id = `activity-${Date.now()}`;

    const { error } = await supabase.from("activity_log").insert({
      id,
      workspace_id: workspaceId,
      actor,
      verb,
      target,
    });

    if (error) {
      console.error("Error logging activity:", error);
      return;
    }

    // Optimistic prepend — the realtime subscription will also refetch,
    // but this makes it show up instantly for the person who triggered it.
    setActivities((prev) => [
      {
        id,
        workspaceId,
        actor,
        verb,
        target,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }

  return (
    <ActivityContext.Provider value={{ activities, loading, logActivity }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return context;
}