import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { createNotification } from "../data/notificationsApi";

const MeetingsContext = createContext(null);

export function MeetingsProvider({ children }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();

    const channel = supabase
      .channel("meetings-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "meetings" },
        () => {
          fetchMeetings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMeetings() {
    setLoading(true);
    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .order("scheduled_at", { ascending: true });

    if (error) {
      console.error("Error fetching meetings:", error);
    } else {
      const mapped = data.map((m) => ({
        id: m.id,
        workspaceId: m.workspace_id,
        projectId: m.project_id,
        title: m.title,
        description: m.description,
        scheduledAt: m.scheduled_at,
        durationMinutes: m.duration_minutes,
        location: m.location,
        organizer: m.organizer,
        attendees: m.attendees ?? [],
        status: m.status,
        notes: m.notes,
        createdAt: m.created_at,
      }));
      setMeetings(mapped);
    }
    setLoading(false);
  }

  async function scheduleMeeting(meeting) {
    const id = `meeting-${Date.now()}`;

    const { error } = await supabase.from("meetings").insert({
      id,
      workspace_id: meeting.workspaceId,
      project_id: meeting.projectId ?? null,
      title: meeting.title,
      description: meeting.description ?? null,
      scheduled_at: meeting.scheduledAt,
      duration_minutes: meeting.durationMinutes ?? 30,
      location: meeting.location ?? null,
      organizer: meeting.organizer,
      attendees: meeting.attendees ?? [],
      status: "Scheduled",
      notes: null,
    });

    if (error) {
      console.error("Error scheduling meeting:", error);
      return { error };
    }

    await fetchMeetings();

    createNotification({
      workspaceId: meeting.workspaceId,
      type: "meeting_scheduled",
      message: `New meeting scheduled: "${meeting.title}"`,
      targetInitials: meeting.attendees,
    });

    return { error: null };
  }

  async function updateMeetingStatus(id, status) {
    const { error } = await supabase
      .from("meetings")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating meeting status:", error);
      return { error };
    }

    setMeetings((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    return { error: null };
  }

  // Meeting notes / minutes — written up after the meeting happens.
  // Saving notes also marks the meeting Completed, since notes only make
  // sense once the meeting has actually occurred.
  async function saveMinutes(id, notes) {
    const { error } = await supabase
      .from("meetings")
      .update({ notes, status: "Completed" })
      .eq("id", id);

    if (error) {
      console.error("Error saving meeting minutes:", error);
      return { error };
    }

    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, notes, status: "Completed" } : m))
    );
    return { error: null };
  }

  async function deleteMeeting(id) {
    const { error } = await supabase.from("meetings").delete().eq("id", id);

    if (error) {
      console.error("Error deleting meeting:", error);
      return { error };
    }

    setMeetings((prev) => prev.filter((m) => m.id !== id));
    return { error: null };
  }

  return (
    <MeetingsContext.Provider
      value={{
        meetings,
        loading,
        scheduleMeeting,
        updateMeetingStatus,
        saveMinutes,
        deleteMeeting,
      }}
    >
      {children}
    </MeetingsContext.Provider>
  );
}

export function useMeetings() {
  const context = useContext(MeetingsContext);
  if (!context) {
    throw new Error("useMeetings must be used within a MeetingsProvider");
  }
  return context;
}
