import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Users } from "lucide-react";
import { useProjects } from "../context/ProjectsContext";
import { useTasks } from "../context/TasksContext";
import { STATUS_STYLES } from "../data/projects";
import { PRIORITY_STYLES } from "../data/tasks";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { tasks } = useTasks();

  const project = projects.find((p) => p.id === projectId);
  const projectTasks = tasks.filter((t) => t.projectId === projectId);

  if (!project) {
    return (
      <div className="px-8 py-8">
        <p className="text-gray-500">Project not found.</p>
        <Link to="/dashboard/projects" className="mt-2 inline-block text-blue-600 hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  const doneCount = projectTasks.filter((t) => t.status === "Done").length;
  const taskProgress = projectTasks.length
    ? Math.round((doneCount / projectTasks.length) * 100)
    : 0;

  return (
    <div className="px-8 py-8">
      <button
        onClick={() => navigate("/dashboard/projects")}
        className="mb-5 flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft size={16} />
        Back to Projects
      </button>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {project.department}
          </p>
          <h1 className="mt-1 text-[32px] font-bold text-gray-900">{project.name}</h1>
        </div>
        <span
          className={`rounded-full px-3 py-1.5 text-sm font-semibold ${STATUS_STYLES[project.status]}`}
        >
          {project.status}
        </span>
      </div>

      <p className="mb-6 max-w-2xl text-[15px] leading-relaxed text-gray-600">
        {project.description}
      </p>

      <div className="mb-8 grid grid-cols-3 gap-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Progress
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{project.progress}%</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Tasks
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {doneCount}/{projectTasks.length}
          </p>
          <p className="mt-2 text-xs text-gray-400">{taskProgress}% complete</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Due date
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-2xl font-bold text-gray-900">
            <Calendar size={20} className="text-gray-400" />
            {project.dueDate}
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <Users size={16} className="text-gray-400" />
        <div className="flex -space-x-2">
          {project.team.map((initials, i) => (
            <div
              key={i}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-50 text-xs font-semibold text-blue-600"
            >
              {initials}
            </div>
          ))}
          {project.teamOverflow > 0 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-gray-500">
              +{project.teamOverflow}
            </div>
          )}
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-gray-900">Tasks in this project</h2>

      {projectTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60 px-6 py-12 text-center">
          <p className="text-sm font-medium text-gray-600">No tasks yet.</p>
          <Link
            to="/dashboard/tasks"
            className="mt-1 inline-block text-sm text-blue-600 hover:underline"
          >
            Go create one
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {projectTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${PRIORITY_STYLES[task.priority]}`}
                >
                  {task.priority}
                </span>
                <p className="text-sm font-medium text-gray-900">{task.title}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{task.status}</span>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-[10px] font-semibold text-blue-600">
                  {task.assignee}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}