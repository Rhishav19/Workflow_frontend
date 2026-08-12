import { Link } from "react-router-dom";
import { Calendar, Trash2 } from "lucide-react";
import { STATUS_STYLES } from "../../data/projects";
import { useWorkspace } from "../../context/WorkspaceContext";
import { hasPermission } from "../../data/permissions";

export default function ProjectCard({ project, onDelete }) {
  const { currentRole } = useWorkspace();
  const canDelete = hasPermission(currentRole, "canManageProject");

  return (
    <div className="group relative">
      {canDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.confirm(`Delete "${project.name}"? This can't be undone.`)) {
              onDelete(project.id);
            }
          }}
          className="absolute right-3 top-3 z-10 rounded-lg bg-white p-1.5 text-gray-300 opacity-0 shadow-sm transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
          aria-label={`Delete ${project.name}`}
        >
          <Trash2 size={15} />
        </button>
      )}

      <Link
        to={`/dashboard/projects/${project.id}`}
        className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-blue-300"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {project.department}
            </p>
            <h3 className="mt-1 text-[17px] font-semibold text-gray-900">
              {project.name}
            </h3>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
              STATUS_STYLES[project.status]
            }`}
          >
            {project.status}
          </span>
        </div>

        <p className="mb-5 text-sm leading-relaxed text-gray-500 line-clamp-2">
          {project.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.team.map((initials, i) => (
              <div
                key={i}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-50 text-[11px] font-semibold text-blue-600"
              >
                {initials}
              </div>
            ))}
            {project.teamOverflow > 0 && (
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[11px] font-medium text-gray-500">
                +{project.teamOverflow}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
            <Calendar size={13} />
            {project.dueDate}
          </div>
        </div>
      </Link>
    </div>
  );
}