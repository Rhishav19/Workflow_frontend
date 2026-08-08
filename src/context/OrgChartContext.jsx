import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";
import { useWorkspace } from "./WorkspaceContext";

const OrgChartContext = createContext(null);

export function OrgChartProvider({ children }) {
  const { user } = useAuth();
  const { workspaceId } = useWorkspace();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId) return;
    fetchMembers();

    const channel = supabase
      .channel("members-org-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "members" },
        () => fetchMembers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId]);

  async function fetchMembers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching members:", error);
    } else {
      const mapped = data.map((m) => ({
        id: m.id,
        workspaceId: m.workspace_id,
        name: m.name,
        email: m.email,
        role: m.role,
        department: m.department,
        position: m.position || "Member",
        reportsTo: m.reports_to,
        departmentColor: m.department_color || "#3b82f6",
        avatarUrl: m.avatar_url,
      }));
      setMembers(mapped);
    }
    setLoading(false);
  }

  async function updateReporting(memberId, updates) {
    const dbUpdates = {};
    if ("reportsTo" in updates) dbUpdates.reports_to = updates.reportsTo;
    if ("position" in updates) dbUpdates.position = updates.position;
    if ("department" in updates) dbUpdates.department = updates.department;
    if ("departmentColor" in updates) dbUpdates.department_color = updates.departmentColor;

    const { error } = await supabase
      .from("members")
      .update(dbUpdates)
      .eq("id", memberId);

    if (error) {
      console.error("Error updating member:", error);
      return { error };
    }

    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, ...updates } : m))
    );
    return { error: null };
  }

  // Build tree structure
  const tree = useMemo(() => {
    const map = new Map(members.map((m) => [m.id, { ...m, children: [] }]));

    let roots = [];
    members.forEach((m) => {
      const node = map.get(m.id);
      if (m.reportsTo && map.has(m.reportsTo)) {
        map.get(m.reportsTo).children.push(node);
      } else {
        roots.push(node);
      }
    });

    // Sort children by name
    const sortTree = (nodes) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name));
      nodes.forEach((n) => sortTree(n.children));
    };
    sortTree(roots);

    return roots;
  }, [members]);

  // Role-based filtered view
  const visibleTree = useMemo(() => {
    if (!user) return [];

    const userRole = user.role;
    const userMember = members.find((m) => m.email === user.email);

    if (userRole === "Admin") return tree;

    if (userRole === "Manager" && userMember) {
      // Show own subtree + manager chain
      const deptMembers = members.filter(
        (m) => m.department === userMember.department
      );
      const deptIds = new Set(deptMembers.map((m) => m.id));

      // Build partial tree with only dept members
      const deptMap = new Map(
        deptMembers.map((m) => [m.id, { ...m, children: [] }])
      );
      let deptRoots = [];
      deptMembers.forEach((m) => {
        const node = deptMap.get(m.id);
        if (m.reportsTo && deptMap.has(m.reportsTo)) {
          deptMap.get(m.reportsTo).children.push(node);
        } else {
          deptRoots.push(node);
        }
      });
      return deptRoots;
    }

    if (userRole === "Employee" && userMember) {
      // Show: manager, self, peers, direct reports
      const relevantIds = new Set([userMember.id]);
      if (userMember.reportsTo) relevantIds.add(userMember.reportsTo);

      // Add direct reports
      members
        .filter((m) => m.reportsTo === userMember.id)
        .forEach((m) => relevantIds.add(m.id));

      // Add peers (same manager)
      if (userMember.reportsTo) {
        members
          .filter((m) => m.reportsTo === userMember.reportsTo)
          .forEach((m) => relevantIds.add(m.id));
      }

      const relMap = new Map(
        Array.from(relevantIds).map((id) => {
          const m = members.find((x) => x.id === id);
          return [id, { ...m, children: [] }];
        })
      );

      let relRoots = [];
      relevantIds.forEach((id) => {
        const m = members.find((x) => x.id === id);
        const node = relMap.get(id);
        if (m.reportsTo && relMap.has(m.reportsTo)) {
          relMap.get(m.reportsTo).children.push(node);
        } else {
          relRoots.push(node);
        }
      });
      return relRoots;
    }

    return [];
  }, [tree, members, user]);

  return (
    <OrgChartContext.Provider
      value={{ members, tree, visibleTree, loading, updateReporting }}
    >
      {children}
    </OrgChartContext.Provider>
  );
}

export function useOrgChart() {
  const context = useContext(OrgChartContext);
  if (!context) {
    throw new Error("useOrgChart must be used within an OrgChartProvider");
  }
  return context;
}