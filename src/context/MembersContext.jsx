import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const MembersContext = createContext(null);

export function MembersProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching members:", error);
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
      }));
      setMembers(mapped);
    }
    setLoading(false);
  }

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
        : [memberData, ...prev]
    );
  }

  return (
    <MembersContext.Provider value={{ members, loading, saveMember }}>
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