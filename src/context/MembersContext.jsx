import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { createNotification } from "../data/notificationsApi";

const MembersContext = createContext(null);

export function MembersProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembers = useCallback(async function fetchMembers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching members:", error);
      setError(error.message);
    } else {
      const mapped = data.map((m) => ({
        id: m.id,
        workspaceId: m.workspace_id,
        name: m.name,
        initials: m.initials,
        email: m.email,
        department: m.department,
        role: m.role,
        status: m.status,
        joinedDate: m.joined_date,
        createdAt: m.created_at,
      }));
      setMembers(mapped);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  async function saveMember(memberData) {
    const exists = members.some((m) => m.id === memberData.id);

    const dbRow = {
      id: memberData.id,
      workspace_id: memberData.workspaceId,
      name: memberData.name,
      initials: memberData.initials,
      email: memberData.email,
      department: memberData.department,
      role: memberData.role,
      status: memberData.status,
      joined_date: memberData.joinedDate,
    };

    const { error } = exists
      ? await supabase.from("members").update(dbRow).eq("id", memberData.id)
      : await supabase.from("members").insert(dbRow);

    if (error) {
      console.error("Error saving member:", error);
      return;
    }

    setMembers((prev) =>
      exists
        ? prev.map((m) => (m.id === memberData.id ? memberData : m))
        : [{ ...memberData, createdAt: new Date().toISOString() }, ...prev]
    );

    if (!exists) {
      createNotification({
        workspaceId: memberData.workspaceId,
        type: "member_added",
        message: `${memberData.name} joined as ${memberData.role}`,
      });
    }
  }

  async function removeMember(memberId, workspaceId, memberName) {
    const { error } = await supabase
      .from("members")
      .delete()
      .eq("id", memberId);

    if (error) {
      console.error("Error removing member:", error);
      return false;
    }

    setMembers((prev) => prev.filter((m) => m.id !== memberId));

    createNotification({
      workspaceId,
      type: "member_removed",
      message: `${memberName} has been removed from the workspace`,
    });

    return true;
  }

  return (
   <MembersContext.Provider value={{ members, loading, saveMember, removeMember, error }}>
      {children}
    </MembersContext.Provider>
  );
}

export function useMembers() {
  const context = useContext(MembersContext);
  if (!context) {
    throw new Error("useMembers must be used within a MembersProvider");
  }
  return context;
}
