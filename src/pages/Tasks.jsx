import { useState } from "react";
import TasksHeader from "../components/tasks/TasksHeader";
import KanbanBoard from "../components/tasks/KanbanBoard";
import { initialTasks } from "../data/tasks";

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);

  function moveTask(taskId, newStatus) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }

  function changePriority(taskId, newPriority) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, priority: newPriority } : task
      )
    );
  }

  return (
    <div className="px-8 py-8">
      <TasksHeader />
      <KanbanBoard tasks={tasks} onMoveTask={moveTask} onChangePriority={changePriority} />
    </div>
  );
}