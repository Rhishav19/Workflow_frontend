import { useState } from "react";
import { Calendar, ChevronDown, Send, Check, RotateCcw, FileText } from "lucide-react";
import { PRIORITY_STYLES } from "../../data/tasks";
import { useProjects } from "../../context/ProjectsContext";
import { useWorkspace } from "../../context/WorkspaceContext";
import { hasPermission } from "../../data/permissions";

const PRIORITIES = ["High", "Medium", "Low"];

export default function TaskCard({
  task,
  onDragStart,
  isDragging,
  onChangePriority,
  onOpenSubmit,
  onApprove,
  onRequestChanges,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentRole } = useWorkspace();
  const { projects } = useProjects();
  const canReview = hasPermission(currentRole, "canReviewTask");
  const canSubmitRole = hasPermission(currentRole, "canSubmitTask");
  const canSubmit =
    canSubmitRole && task.status !== "Review" && task.status !== "Done";
  const projectName = projects.find((p) => p.id === task.projectId)?.name ?? "Unknown project";

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className={`relative cursor-grab rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-opacity active:cursor-grabbing ${
        isDragging ? "opacity-40" : "opacity-100"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${PRIORITY_STYLES[task.priority]}`}
          >
            {task.priority}
            <ChevronDown size={11} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute left-0 top-7 z-20 w-28 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      onChangePriority(task.id, p);
                      setMenuOpen(false);
                    }}
                    className={`block w-full px-3 py-1.5 text-left text-xs font-medium hover:bg-gray-50 ${
                      p === task.priority ? "text-blue-600" : "text-gray-600"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-[10px] font-semibold text-blue-600">
          {task.assignee}
        </div>
      </div>

      <p className="mb-1 text-sm font-medium leading-snug text-gray-900">
        {task.title}
      </p>
      <p className="mb-3 text-xs text-gray-400">{projectName}</p>

      <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-400">
        <Calendar size={12} />
        {task.dueDate}
      </div>

      {task.submission && (
        <div className="mb-3 rounded-lg bg-gray-50 px-2.5 py-2 text-xs text-gray-600">
          <p className="font-medium text-gray-700">
            Submitted {task.submission.submittedAt}
          </p>
          <p className="mt-0.5 text-gray-500">{task.submission.note}</p>
          {task.submission.fileName && (
            <p className="mt-1 flex items-center gap-1 text-gray-400">
              <FileText size={11} />
              {task.submission.fileName}
            </p>
          )}
        </div>
      )}

      {canSubmit && (
        <button
          onClick={() => onOpenSubmit(task)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100"
        >
          <Send size={12} />
          Submit
        </button>
      )}

      {task.status === "Review" && canReview && (
        <div className="flex gap-2">
          <button
            onClick={() => onApprove(task.id)}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-50 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-100"
          >
            <Check size={12} />
            Approve
          </button>
          <button
            onClick={() => onRequestChanges(task.id)}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-amber-50 py-1.5 text-xs font-semibold text-amber-600 hover:bg-amber-100"
          >
            <RotateCcw size={12} />
            Changes
          </button>
        </div>
      )}
    </div>
  );
}