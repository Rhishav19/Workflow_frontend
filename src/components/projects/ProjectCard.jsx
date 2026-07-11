import { Calendar } from "lucide-react";
import { STATUS_STYLES } from "../../data/projects";

export default function ProjectCard({ project }) {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-blue-300">
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

      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-gray-400">Progress</span>
          <span className="font-semibold text-gray-900">{project.progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

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
    </div>
  );
}