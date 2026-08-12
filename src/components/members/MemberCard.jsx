import { Mail, Pencil, Trash2 } from "lucide-react";
import { ROLE_STYLES } from "../../data/members";
import { useWorkspace } from "../../context/WorkspaceContext";
import { hasPermission } from "../../data/permissions";

export default function MemberCard({ member, onEdit, onDelete }) {
  const { currentRole } = useWorkspace();
  const canRemove = hasPermission(currentRole, "canRemoveMember");

  return (
    <div className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-blue-300">
      <div className="absolute right-4 top-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(member)}
          className="rounded-lg p-1.5 text-gray-300 hover:bg-gray-100 hover:text-gray-600"
          aria-label={`Edit ${member.name}`}
        >
          <Pencil size={15} />
        </button>
        {canRemove && (
          <button
            onClick={() => {
              if (window.confirm(`Remove ${member.name} from this workspace?`)) {
                onDelete(member.id);
              }
            }}
            className="rounded-lg p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500"
            aria-label={`Remove ${member.name}`}
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <div className="mb-4 flex items-start justify-between pr-14">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
            {member.initials}
          </div>
          <div>
            <p className="text-[15px] font-semibold text-gray-900">
              {member.name}
            </p>
            <p className="text-xs text-gray-400">{member.department}</p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${ROLE_STYLES[member.role]}`}
        >
          {member.role}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Mail size={13} />
          {member.email}
        </div>
        <span className="text-xs text-gray-400">Joined {member.joinedDate}</span>
      </div>
    </div>
  );
}