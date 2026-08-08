import StatCard from "./StatCard";
import { useProjects } from "../../context/ProjectsContext";
import { useTasks } from "../../context/TasksContext";
import { useMembers } from "../../context/MembersContext";
import { useWorkspace } from "../../context/WorkspaceContext";

const StatsSection = () => {
  const { workspaceId } = useWorkspace();
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const { members } = useMembers();

  const workspaceProjects = projects.filter((p) => p.workspaceId === workspaceId);
  const workspaceTasks = tasks.filter((t) => t.workspaceId === workspaceId);
  const workspaceMembers = members.filter((m) => m.workspaceId === workspaceId);

  const activeProjectsCount = workspaceProjects.filter(
    (p) => p.status !== "Completed"
  ).length;

  const pendingTasksCount = workspaceTasks.filter(
    (t) => t.status !== "Done"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Active Projects"
        value={activeProjectsCount}
        color="text-blue-600"
      />

      <StatCard
        title="Tasks Pending"
        value={pendingTasksCount}
        color="text-green-600"
      />

      <StatCard
        title="Budget"
        value="—"
        color="text-purple-600"
      />

      <StatCard
        title="Team Members"
        value={workspaceMembers.length}
        color="text-orange-500"
      />
    </div>
  );
};

export default StatsSection;