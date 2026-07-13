import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getWorkspaceById } from "../data/workspaces";

const WorkspaceContext = createContext(null);
const STORAGE_KEY = "workflow_workspace";

export function WorkspaceProvider({ children }) {
  const { user } = useAuth();
  const [workspaceId, setWorkspaceId] = useState(() =>
    localStorage.getItem(STORAGE_KEY)
  );

  useEffect(() => {
    if (!user?.memberships) {
      setWorkspaceId(null);
      return;
    }
    const belongsToCurrent = user.memberships.some(
      (m) => m.workspaceId === workspaceId
    );
    if (!belongsToCurrent) {
      setWorkspaceId(user.memberships[0]?.workspaceId ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (workspaceId) {
      localStorage.setItem(STORAGE_KEY, workspaceId);
    }
  }, [workspaceId]);

  const membership = user?.memberships?.find((m) => m.workspaceId === workspaceId);
  const currentRole = membership?.role ?? null;
  const currentWorkspace = workspaceId ? getWorkspaceById(workspaceId) : null;

  const myWorkspaces = user?.memberships
    ? user.memberships
        .map((m) => ({ ...getWorkspaceById(m.workspaceId), role: m.role }))
        .filter((w) => w.id)
    : [];

  function switchWorkspace(id) {
    setWorkspaceId(id);
  }

  return (
    <WorkspaceContext.Provider
      value={{ workspaceId, currentWorkspace, currentRole, myWorkspaces, switchWorkspace }}
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