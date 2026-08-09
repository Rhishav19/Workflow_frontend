import { useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { columns } from "../../data/tasks";
import { useWorkspace } from "../../context/WorkspaceContext";
import { canMoveTask } from "../../data/permissions";

export default function KanbanBoard({
  tasks,
  onMoveTask,
  onChangePriority,
  onOpenSubmit,
  onApprove,
  onRequestChanges,
  onDelete,
}) {
  const { currentRole } = useWorkspace();
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
    const task = tasks.find((t) => t.id === draggingId);
    if (task && canMoveTask(currentRole, task.status, columnTitle)) {
      onMoveTask(draggingId, columnTitle);
    }
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
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}