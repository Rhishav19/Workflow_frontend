import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  Send,
  Check,
  RotateCcw,
  FileText,
  Trash2,
  MessageSquare,
  StickyNote,
  X,
} from "lucide-react";
import { columns, PRIORITY_STYLES } from "../../data/tasks";
import { useProjects } from "../../context/ProjectsContext";
import { useWorkspace } from "../../context/WorkspaceContext";
import { hasPermission, canMoveTask } from "../../data/permissions";
import { initialsFor } from "../../utils/initials";

const PRIORITIES = ["High", "Medium", "Low"];

export default function TaskCard({
  task,
  onDragStart,
  isDragging,
  onChangePriority,
  onOpenSubmit,
  onApprove,
  onRequestChanges,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const { currentRole } = useWorkspace();
  const { projects } = useProjects();
  const canReview = hasPermission(currentRole, "canReviewTask");
  const canSubmitRole = hasPermission(currentRole, "canSubmitTask");
  const canDelete = hasPermission(currentRole, "canDeleteTask");
  const canSubmit =
    canSubmitRole && task.status !== "Review" && task.status !== "Done";
  const projectName =
    projects.find((p) => p.id === task.projectId)?.name ?? "Unknown project";
  const canDrag = columns.some(
    (col) => col !== task.status && canMoveTask(currentRole, task.status, col)
  );

  return (
    <>
      <div
        draggable={canDrag}
        onDragStart={(e) => canDrag && onDragStart(e, task.id)}
        onClick={() => setDetailOpen(true)}
        title={!canDrag ? "You can't move this task from here" : undefined}
        className={`relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-opacity ${
          canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
        } ${isDragging ? "opacity-40" : "opacity-100"}`}
      >
        <div className="mb-2 flex items-center justify-between">
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((open) => !open);
              }}
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${PRIORITY_STYLES[task.priority]}`}
            >
              {task.priority}
              <ChevronDown size={11} />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                  }}
                />
                <div className="absolute left-0 top-7 z-20 w-28 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
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

          <div className="flex items-center gap-1.5">
            <div
              title={task.assignee}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-[10px] font-semibold text-blue-600"
            >
              {initialsFor(task.assignee)}
            </div>
            {canDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Delete "${task.title}"?`)) {
                    onDelete(task.id);
                  }
                }}
                className="flex h-6 w-6 items-center justify-center rounded-full text-gray-300 hover:bg-red-50 hover:text-red-500"
                aria-label="Delete task"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        <p className="mb-1.5 text-sm font-medium leading-snug text-gray-900">
          {task.title}
        </p>
        <p className="mb-3 text-xs text-gray-400">{projectName}</p>

        <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar size={12} />
          {task.dueDate}
        </div>

        {/* Employee submission */}
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

        {/* Changes requested */}
        {task.changesNote && (
          <div className="mb-3 rounded-lg bg-amber-50 px-2.5 py-2 text-xs text-amber-700">
            <p className="flex items-center gap-1 font-semibold">
              <MessageSquare size={11} />
              Changes Requested
            </p>
            <p className="mt-0.5 text-amber-600">{task.changesNote}</p>
          </div>
        )}

        {/* Manager/Admin change note */}
        {task.changeNote && !task.changesNote && (
          <div className="mb-3 rounded-lg bg-blue-50 px-2.5 py-2 text-xs text-blue-700">
            <p className="flex items-center gap-1 font-semibold">
              <StickyNote size={11} />
              Note
            </p>
            <p className="mt-0.5 text-blue-600">{task.changeNote}</p>
          </div>
        )}

        {/* Submit button */}
        {canSubmit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenSubmit(task);
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100"
          >
            <Send size={12} />
            Submit
          </button>
        )}

        {/* Review buttons */}
        {task.status === "Review" && canReview && (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApprove(task);
              }}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-50 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-100"
            >
              <Check size={12} />
              Approve
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRequestChanges(task);
              }}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-amber-50 py-1.5 text-xs font-semibold text-amber-600 hover:bg-amber-100"
            >
              <RotateCcw size={12} />
              Changes
            </button>
          </div>
        )}
      </div>

      {detailOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setDetailOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${PRIORITY_STYLES[task.priority]}`}
                >
                  {task.priority}
                </span>
                <h2 className="mt-2 text-lg font-semibold text-gray-900">
                  {task.title}
                </h2>
              </div>
              <button
                onClick={() => setDetailOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Description
                </p>
                <p className="text-sm leading-relaxed text-gray-700">
                  {task.description || "No description provided."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Project
                  </p>
                  <p className="text-gray-700">{projectName}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Status
                  </p>
                  <p className="text-gray-700">{task.status}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Assignee
                  </p>
                  <p className="text-gray-700">{task.assignee}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Due date
                  </p>
                  <p className="flex items-center gap-1.5 text-gray-700">
                    <Calendar size={13} />
                    {task.dueDate}
                  </p>
                </div>
              </div>

              {task.submission && (
                <div className="rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
                  <p className="font-medium text-gray-700">
                    Submitted {task.submission.submittedAt}
                  </p>
                  <p className="mt-0.5 text-gray-500">{task.submission.note}</p>
                  {task.submission.fileName && (
                    <p className="mt-1 flex items-center gap-1 text-gray-400">
                      <FileText size={12} />
                      {task.submission.fileName}
                    </p>
                  )}
                </div>
              )}

              {task.changesNote && (
                <div className="rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-700">
                  <p className="flex items-center gap-1.5 font-semibold">
                    <MessageSquare size={13} />
                    Changes Requested
                  </p>
                  <p className="mt-0.5 text-amber-600">{task.changesNote}</p>
                </div>
              )}

              {task.changeNote && !task.changesNote && (
                <div className="rounded-lg bg-blue-50 px-3 py-2.5 text-sm text-blue-700">
                  <p className="flex items-center gap-1.5 font-semibold">
                    <StickyNote size={13} />
                    Note
                  </p>
                  <p className="mt-0.5 text-blue-600">{task.changeNote}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}