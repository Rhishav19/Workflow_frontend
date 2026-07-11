import { useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { columns } from "../../data/tasks";

export default function KanbanBoard({ tasks, onMoveTask, onChangePriority }) {
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
    <div className="flex gap-4 overflow-x-auto pb-4">
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
        />
      ))}
    </div>
  );
}