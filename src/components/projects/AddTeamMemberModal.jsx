import { useState } from "react";
import { X } from "lucide-react";
import { useMembers } from "../../context/MembersContext";
import { useWorkspace } from "../../context/WorkspaceContext";
import { initialsFor } from "../../utils/initials";

export default function AddTeamMemberModal({ project, onClose, onAdd }) {
  const { workspaceId } = useWorkspace();
  const { members } = useMembers();
  const [selectedId, setSelectedId] = useState("");
  const [error, setError] = useState("");

  const workspaceMembers = members.filter((m) => m.workspaceId === workspaceId);

  // Don't offer people already on the team again.
  const currentInitials = project.team ?? [];
  const availableMembers = workspaceMembers.filter(
    (m) => !currentInitials.includes(initialsFor(m.name))
  );

  function handleSubmit(e) {
    e.preventDefault();
    const member = availableMembers.find((m) => m.id === selectedId);
    if (!member) {
      setError("Pick a member to add.");
      return;
    }
    onAdd(initialsFor(member.name));
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Add to Team</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          {availableMembers.length === 0 ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              Everyone in this workspace is already on the team.
            </p>
          ) : (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Member
              </label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select a member...</option>
                {availableMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.role}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg px-4 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={availableMembers.length === 0}
              className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Add to Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}