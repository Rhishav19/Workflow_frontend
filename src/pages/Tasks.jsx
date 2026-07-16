import { useState } from "react";
import TasksHeader from "../components/tasks/TasksHeader";
import KanbanBoard from "../components/tasks/KanbanBoard";
import NewTaskModal from "../components/tasks/NewTaskModal";
import SubmitTaskModal from "../components/tasks/SubmitTaskModal";
import { useTasks } from "../context/TasksContext";
import { useWorkspace } from "../context/WorkspaceContext";

export default function Tasks() {
  const { workspaceId } = useWorkspace();
  const {
    tasks,
    addTask,
    moveTask,
    changePriority,
    submitTask,
    approveTask,
    requestChanges,
  } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [submittingTask, setSubmittingTask] = useState(null);

  const workspaceTasks = tasks.filter((t) => t.workspaceId === workspaceId);

  function handleCreate(newTask) {
    addTask({ ...newTask, workspaceId });
  }

  return (
    <div className="min-w-0 px-8 py-8">
      <TasksHeader onNewTask={() => setModalOpen(true)} />
      <KanbanBoard
        tasks={workspaceTasks}
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
          onSubmit={(taskId, submission) => {
            submitTask(taskId, submission);
            setSubmittingTask(null);
          }}
        />
      )}
    </div>
  );
}