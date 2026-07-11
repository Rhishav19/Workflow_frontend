import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { PRIORITY_STYLES } from "../../data/tasks";

const PRIORITIES = ["High", "Medium", "Low"];

export default function TaskCard({ task, onDragStart, isDragging, onChangePriority }) {
  const [menuOpen, setMenuOpen] = useState(false);

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
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
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
      <p className="mb-3 text-xs text-gray-400">{task.project}</p>

      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <Calendar size={12} />
        {task.dueDate}
      </div>
    </div>
  );
}