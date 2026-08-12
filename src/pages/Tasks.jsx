import { useState } from "react";
import TasksHeader from "../components/tasks/TasksHeader";
import KanbanBoard from "../components/tasks/KanbanBoard";
import NewTaskModal from "../components/tasks/NewTaskModal";
import SubmitTaskModal from "../components/tasks/SubmitTaskModal";
import RequestChangesModal from "../components/tasks/RequestChangesModal";
import ApproveTaskModal from "../components/tasks/ApproveTaskModal";
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
    deleteTask,
  } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [submittingTask, setSubmittingTask] = useState(null);
  const [requestingTask, setRequestingTask] = useState(null);
  const [approvingTask, setApprovingTask] = useState(null);

  const workspaceTasks = tasks.filter((t) => t.workspaceId === workspaceId);

  function handleCreate(newTask) {
    addTask({ ...newTask, workspaceId });
  }

  function handleRequestChanges(taskId, note) {
    requestChanges(taskId, note);
    setRequestingTask(null);
  }

  function handleApprove(taskId, note) {
    approveTask(taskId, note);
    setApprovingTask(null);
  }

  return (
    <div className="min-w-0 px-8 py-8">
      <TasksHeader onNewTask={() => setModalOpen(true)} />
      <KanbanBoard
        tasks={workspaceTasks}
        onMoveTask={moveTask}
        onChangePriority={changePriority}
        onOpenSubmit={setSubmittingTask}
        onApprove={setApprovingTask}
        onRequestChanges={setRequestingTask}
        onDelete={deleteTask}
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

      {requestingTask && (
        <RequestChangesModal
          task={requestingTask}
          onClose={() => setRequestingTask(null)}
          onSubmit={handleRequestChanges}
        />
      )}

      {approvingTask && (
        <ApproveTaskModal
          task={approvingTask}
          onClose={() => setApprovingTask(null)}
          onSubmit={handleApprove}
        />
      )}
    </div>
  );
}