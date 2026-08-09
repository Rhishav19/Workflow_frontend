import { useState } from "react";
import TasksHeader from "../components/tasks/TasksHeader";
import KanbanBoard from "../components/tasks/KanbanBoard";
import NewTaskModal from "../components/tasks/NewTaskModal";
import SubmitTaskModal from "../components/tasks/SubmitTaskModal";
import { useTasks } from "../context/TasksContext";
import { useProjects } from "../context/ProjectsContext";
import { useWorkspace } from "../context/WorkspaceContext";
import { useAuth } from "../context/AuthContext";
import { useActivity } from "../context/ActivityContext";
import { useMembers } from "../context/MembersContext";
import { useNotifications } from "../context/NotificationsContext";
import { hasPermission } from "../data/permissions";
import { initialsFor } from "../utils/initials";

export default function Tasks() {
  const { workspaceId } = useWorkspace();
  const { user } = useAuth();
  const { logActivity } = useActivity();
  const { notify, notifyMany } = useNotifications();
  const { projects } = useProjects();
  const { members } = useMembers();
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

  const workspaceTasks = tasks.filter((t) => t.workspaceId === workspaceId);
  const workspaceMembers = members.filter((m) => m.workspaceId === workspaceId);
  const actor = user?.name ?? "Someone";

  function projectNameFor(projectId) {
    return projects.find((p) => p.id === projectId)?.name ?? "Unknown project";
  }

  function emailFor(assigneeValue) {
    if (!assigneeValue) return undefined;

    const exact = workspaceMembers.find((m) => m.name === assigneeValue);
    if (exact) return exact.email;

    // Legacy fallback: tasks created before the assignee dropdown was
    // added may still have a 2-letter initials code instead of a full
    // name. Try matching on that so old tasks still notify correctly.
    const byInitials = workspaceMembers.find(
      (m) => initialsFor(m.name) === assigneeValue.toUpperCase()
    );
    return byInitials?.email;
  }

  function log(verb, task) {
    logActivity({
      workspaceId,
      actor,
      verb,
      target: task.title,
      project: projectNameFor(task.projectId),
    });
  }

  function handleCreate(newTask) {
    addTask({ ...newTask, workspaceId });
    log("created a task", newTask);

    const assigneeEmail = emailFor(newTask.assignee);
    if (assigneeEmail && assigneeEmail !== user?.email) {
      notify({
        workspaceId,
        recipientEmail: assigneeEmail,
        actor,
        title: `${actor} assigned you a task`,
        body: newTask.title,
        link: "/dashboard/tasks",
      });
    }
  }

  function handleMove(taskId, newStatus) {
    const task = tasks.find((t) => t.id === taskId);
    moveTask(taskId, newStatus);
    if (task) log(`moved a task to ${newStatus}`, task);
  }

  function handleChangePriority(taskId, newPriority) {
    const task = tasks.find((t) => t.id === taskId);
    changePriority(taskId, newPriority);
    if (task) log(`set priority to ${newPriority} on`, task);
  }

  function handleApprove(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    approveTask(taskId);
    if (task) {
      log("approved", task);
      const assigneeEmail = emailFor(task.assignee);
      if (assigneeEmail) {
        notify({
          workspaceId,
          recipientEmail: assigneeEmail,
          actor,
          title: `${actor} approved your task`,
          body: task.title,
          link: "/dashboard/tasks",
        });
      }
    }
  }

  function handleRequestChanges(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    requestChanges(taskId);
    if (task) {
      log("requested changes on", task);
      const assigneeEmail = emailFor(task.assignee);
      if (assigneeEmail) {
        notify({
          workspaceId,
          recipientEmail: assigneeEmail,
          actor,
          title: `${actor} requested changes on your task`,
          body: task.title,
          link: "/dashboard/tasks",
        });
      }
    }
  }

  function handleDelete(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    deleteTask(taskId);
    if (task) log("deleted", task);
  }

  return (
    <div className="min-w-0 px-8 py-8">
      <TasksHeader onNewTask={() => setModalOpen(true)} />
      <KanbanBoard
        tasks={workspaceTasks}
        onMoveTask={handleMove}
        onChangePriority={handleChangePriority}
        onOpenSubmit={setSubmittingTask}
        onApprove={handleApprove}
        onRequestChanges={handleRequestChanges}
        onDelete={handleDelete}
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
            log("submitted", submittingTask);

            const reviewerEmails = workspaceMembers
              .filter((m) => hasPermission(m.role, "canReviewTask"))
              .map((m) => m.email)
              .filter((email) => email && email !== user?.email);

            if (reviewerEmails.length > 0) {
              notifyMany(reviewerEmails, {
                workspaceId,
                actor,
                title: `${actor} submitted a task for review`,
                body: submittingTask.title,
                link: "/dashboard/tasks",
              });
            }

            setSubmittingTask(null);
          }}
        />
      )}
    </div>
  );
}