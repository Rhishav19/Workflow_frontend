import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";
import { useWorkspace } from "./WorkspaceContext";
import { getInitials } from "../utils/initials";

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const { user } = useAuth();
  const { workspaceId, currentRole } = useWorkspace();
  const [notifications, setNotifications] = useState([]);

  const myInitials = getInitials(user?.name);

  function isMine(n) {
    if (n.workspace_id !== workspaceId) return false;
    if (n.target_roles && n.target_roles.includes(currentRole)) return true;
    if (n.target_initials && n.target_initials === myInitials) return true;
    if (!n.target_roles && !n.target_initials) return true; // broadcast to everyone
    return false;
  }

  useEffect(() => {
    if (!workspaceId) {
      setNotifications([]);
      return;
    }

    fetchNotifications();

    const channel = supabase
      .channel(`notifications-${workspaceId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          if (isMine(payload.new)) {
            setNotifications((prev) => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, currentRole, myInitials]);

  async function fetchNotifications() {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      console.error("Error fetching notifications:", error);
      return;
    }

    setNotifications(data.filter(isMine));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  async function markAsRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  }

  async function markAllAsRead() {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await supabase.from("notifications").update({ read: true }).in("id", unreadIds);
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
}