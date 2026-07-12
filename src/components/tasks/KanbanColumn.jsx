import TaskCard from "./TaskCard";

const COLUMN_ACCENT = {
  "To Do": "bg-gray-300",
  "In Progress": "bg-blue-500",
  Review: "bg-amber-500",
  Done: "bg-emerald-500",
};

export default function KanbanColumn({
  title,
  tasks,
  draggingId,
  onDragStart,
  onDrop,
  onDragOver,
  isDragOver,
  onChangePriority,
}) {
  return (
    <div
      onDragOver={(e) => onDragOver(e, title)}
      onDrop={(e) => onDrop(e, title)}
      className={`flex w-full flex-col rounded-2xl border p-3 transition-colors md:w-72 md:shrink-0 ${
        isDragOver ? "border-blue-300 bg-blue-50/40" : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className={`h-2 w-2 rounded-full ${COLUMN_ACCENT[title]}`} />
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <span className="ml-auto text-xs font-medium text-gray-400">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-3 min-h-[80px]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            isDragging={draggingId === task.id}
            onChangePriority={onChangePriority}
          />
        ))}
        {tasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 py-6 text-center text-xs text-gray-400">
            No tasks here
          </div>
        )}
      </div>
    </div>
  );
}