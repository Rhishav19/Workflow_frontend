import { useState } from "react";
import { Building2, ChevronDown, Plus, Check } from "lucide-react";
import { useWorkspace } from "../context/WorkspaceContext";
import { useAuth } from "../context/AuthContext";
import CreateWorkspaceModal from "./CreateWorkspaceModal";

export default function WorkspaceSwitcher() {
  const { currentWorkspace, myWorkspaces, switchWorkspace } = useWorkspace();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const isAdminSomewhere = user?.memberships.some((m) => m.role === "Admin");

  return (
    <div className="relative border-b border-gray-100 px-4 py-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-gray-50"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Building2 size={16} />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-sm font-semibold text-gray-900">
            {currentWorkspace?.name ?? "Select workspace"}
          </p>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-4 right-4 top-14 z-20 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            {myWorkspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  switchWorkspace(ws.id);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-900">{ws.name}</p>
                  <p className="text-xs text-gray-400">{ws.role}</p>
                </div>
                {ws.id === currentWorkspace?.id && (
                  <Check size={15} className="text-blue-600" />
                )}
              </button>
            ))}

            {isAdminSomewhere && (
              <button
                onClick={() => {
                  setOpen(false);
                  setCreateOpen(true);
                }}
                className="flex w-full items-center gap-2 border-t border-gray-100 px-4 py-2.5 text-left text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                <Plus size={15} />
                New Workspace
              </button>
            )}
          </div>
        </>
      )}

      {createOpen && <CreateWorkspaceModal onClose={() => setCreateOpen(false)} />}
    </div>
  );
}