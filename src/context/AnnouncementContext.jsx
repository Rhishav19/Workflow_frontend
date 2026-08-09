import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AnnouncementsContext = createContext(null);

export function AnnouncementsProvider({ children }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();

    const channel = supabase
      .channel("announcements-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcements" },
        () => {
          fetchAnnouncements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
        createdAt: a.created_at,
      }));
      setAnnouncements(mapped);
    }
    setLoading(false);
  }

  async function addAnnouncement(newAnnouncement) {
    const { error } = await supabase.from("announcements").insert({
      id: newAnnouncement.id,
      workspace_id: newAnnouncement.workspaceId,
      title: newAnnouncement.title,
      body: newAnnouncement.body,
      author: newAnnouncement.author,
      department: newAnnouncement.department,
      priority: newAnnouncement.priority,
      pinned: newAnnouncement.pinned,
    });

    if (error) {
      console.error("Error creating announcement:", error);
      return { error };
    }

    await fetchAnnouncements();
    return { error: null };
  }

  async function togglePin(id) {
    const current = announcements.find((a) => a.id === id);
    if (!current) return;

    const nextPinned = !current.pinned;

    const { error } = await supabase
      .from("announcements")
      .update({ pinned: nextPinned })
      .eq("id", id);

    if (error) {
      console.error("Error updating announcement:", error);
      return;
    }

    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, pinned: nextPinned } : a))
    );
  }

 async function deleteAnnouncement(id) {
    const { error } = await supabase.from("announcements").delete().eq("id", id);

    if (error) {
      console.error("Error deleting announcement:", error);
      return { error };
    }

    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    return { error: null };
  }

  return (
    <AnnouncementsContext.Provider
      value={{ announcements, loading, addAnnouncement, togglePin, deleteAnnouncement }}
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