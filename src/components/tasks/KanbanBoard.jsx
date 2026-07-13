import { useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { columns } from "../../data/tasks";

export default function KanbanBoard({
  tasks,
  onMoveTask,
  onChangePriority,
  onOpenSubmit,
  onApprove,
  onRequestChanges,
}) {
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  function handleDragStart(e, taskId) {
    setDraggingId(taskId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e, columnTitle) {
    e.preventDefault();
    if (dragOverColumn !== columnTitle) setDragOverColumn(columnTitle);
  }

  function handleDrop(e, columnTitle) {
    e.preventDefault();
    if (draggingId) onMoveTask(draggingId, columnTitle);
    setDraggingId(null);
    setDragOverColumn(null);
  }

  return (
    <div className="flex min-w-0 flex-col gap-4 pb-4 md:flex-row md:overflow-x-auto">
      {columns.map((column) => (
        <KanbanColumn
          key={column}
          title={column}
          tasks={tasks.filter((t) => t.status === column)}
          draggingId={draggingId}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragOver={dragOverColumn === column}
          onChangePriority={onChangePriority}
          onOpenSubmit={onOpenSubmit}
          onApprove={onApprove}
          onRequestChanges={onRequestChanges}
        />
      ))}
    </div>
  );
}