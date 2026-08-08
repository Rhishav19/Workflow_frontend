import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { fetchMembershipsForEmail } from "../data/workspacesApi";

const WorkspaceContext = createContext(null);
const STORAGE_KEY = "workflow_workspace";

export function WorkspaceProvider({ children }) {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState([]);
  const [workspaceId, setWorkspaceId] = useState(() =>
    localStorage.getItem(STORAGE_KEY)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setMemberships([]);
      setWorkspaceId(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchMembershipsForEmail(user.email).then((result) => {
      setMemberships(result);

      const belongsToCurrent = result.some((m) => m.workspaceId === workspaceId);
      if (!belongsToCurrent) {
        setWorkspaceId(result[0]?.workspaceId ?? null);
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (workspaceId) {
      localStorage.setItem(STORAGE_KEY, workspaceId);
    }
  }, [workspaceId]);

  const membership = memberships.find((m) => m.workspaceId === workspaceId);
  const currentRole = membership?.role ?? null;
  const currentWorkspace = membership
    ? { id: membership.workspaceId, name: membership.name }
    : null;

  const myWorkspaces = memberships.map((m) => ({
    id: m.workspaceId,
    name: m.name,
    role: m.role,
  }));

  function switchWorkspace(id) {
    setWorkspaceId(id);
  }

  async function refreshMemberships() {
    if (!user?.email) return;
    const result = await fetchMembershipsForEmail(user.email);
    setMemberships(result);
  }

  return (
    <WorkspaceContext.Provider
      value={{
        workspaceId,
        currentWorkspace,
        currentRole,
        myWorkspaces,
        switchWorkspace,
        refreshMemberships,
        loading,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}