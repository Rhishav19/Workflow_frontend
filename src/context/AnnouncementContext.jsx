import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { createNotification } from "../data/notificationsApi";

const AnnouncementsContext = createContext(null);

export function AnnouncementsProvider({ children }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    setLoading(true);
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching announcements:", error);
    } else {
      const mapped = data.map((a) => ({
        id: a.id,
        workspaceId: a.workspace_id,
        title: a.title,
        body: a.body,
        author: a.author,
        department: a.department,
        priority: a.priority,
        pinned: a.pinned,
        postedAt: a.posted_at,
      }));
      setAnnouncements(mapped);
    }
    setLoading(false);
  }

  async function addAnnouncement(announcement) {
    const { error } = await supabase.from("announcements").insert({
      id: announcement.id,
      workspace_id: announcement.workspaceId,
      title: announcement.title,
      body: announcement.body,
      author: announcement.author,
      department: announcement.department,
      priority: announcement.priority,
      pinned: announcement.pinned,
      posted_at: announcement.postedAt,
    });

    if (error) {
      console.error("Error creating announcement:", error);
      return;
    }

    setAnnouncements((prev) => [announcement, ...prev]);

    createNotification({
      workspaceId: announcement.workspaceId,
      type: "announcement",
      message: `New announcement: "${announcement.title}"`,
    });
  }

  async function togglePin(id) {
    const target = announcements.find((a) => a.id === id);
    if (!target) return;

    const newPinned = !target.pinned;

    const { error } = await supabase
      .from("announcements")
      .update({ pinned: newPinned })
      .eq("id", id);

    if (error) {
      console.error("Error toggling pin:", error);
      return;
    }

    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, pinned: newPinned } : a))
    );
  }

  return (
    <AnnouncementsContext.Provider
      value={{ announcements, addAnnouncement, togglePin, loading }}
    >
      {children}
    </AnnouncementsContext.Provider>
  );
}

export function useAnnouncements() {
  const context = useContext(AnnouncementsContext);
  if (!context) {
    throw new Error("useAnnouncements must be used within an AnnouncementsProvider");
  }
  return context;
}