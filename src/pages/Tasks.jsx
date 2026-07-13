import { useState } from "react";
import TasksHeader from "../components/tasks/TasksHeader";
import KanbanBoard from "../components/tasks/KanbanBoard";
import NewTaskModal from "../components/tasks/NewTaskModal";
import SubmitTaskModal from "../components/tasks/SubmitTaskModal";
import { initialTasks } from "../data/tasks";

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [submittingTask, setSubmittingTask] = useState(null);

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

  function handleCreate(newTask) {
    setTasks((prev) => [newTask, ...prev]);
  }

  function handleSubmitTask(taskId, submission) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: "Review", submission }
          : task
      )
    );
  }

  function approveTask(taskId) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: "Done" } : task
      )
    );
  }

  function requestChanges(taskId) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: "In Progress", submission: null }
          : task
      )
    );
  }

  return (
    <div className="min-w-0 px-8 py-8">
      <TasksHeader onNewTask={() => setModalOpen(true)} />
      <KanbanBoard
        tasks={tasks}
        onMoveTask={moveTask}
        onChangePriority={changePriority}
        onOpenSubmit={setSubmittingTask}
        onApprove={approveTask}
        onRequestChanges={requestChanges}
      />

      {modalOpen && (
        <NewTaskModal onClose={() => setModalOpen(false)} onCreate={handleCreate} />
      )}

      {submittingTask && (
        <SubmitTaskModal
          task={submittingTask}
          onClose={() => setSubmittingTask(null)}
          onSubmit={handleSubmitTask}
        />
      )}
    </div>
  );
}