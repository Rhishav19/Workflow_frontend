import { Plus } from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext";
import { hasPermission } from "../../data/permissions";

export default function MembersHeader({ total, onAddMember }) {
  const { currentRole } = useWorkspace();
  const canAdd = hasPermission(currentRole, "canAddMember");

  return (
    <div className="mb-7 flex items-start justify-between">
      <div>
        <h1 className="text-[32px] font-bold text-gray-900">Members</h1>
        <p className="mt-1 text-[15px] text-gray-500">
          {total} {total === 1 ? "person" : "people"} across your workspace.
        </p>
      </div>
      {canAdd && (
        <button
          onClick={onAddMember}
          className="flex h-11 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-[15px] font-medium text-white hover:bg-blue-700"
        >
          <Plus size={17} />
          Add Member
        </button>
      )}
    </div>
  );
}