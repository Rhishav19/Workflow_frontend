import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Users, ChevronDown, Trash2 } from "lucide-react";
import { useProjects } from "../context/ProjectsContext";
import { useTasks } from "../context/TasksContext";
import { useWorkspace } from "../context/WorkspaceContext";
import { hasPermission } from "../data/permissions";
import { STATUS_STYLES } from "../data/projects";
import { PRIORITY_STYLES } from "../data/tasks";
import { initialsFor } from "../utils/initials";
import { Plus, X as XIcon } from "lucide-react";
import AddTeamMemberModal from "../components/projects/AddTeamMemberModal";

const PROJECT_STATUSES = ["Planning", "On Track", "At Risk", "Completed"];

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, updateProject, deleteProject } = useProjects();
  const { tasks } = useTasks();
  const { currentRole } = useWorkspace();
  const canManage = hasPermission(currentRole, "canManageProject");
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);

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
  function handleAddTeamMember(initials) {
  const currentTeam = project.team ?? [];
  updateProject(project.id, { team: [...currentTeam, initials] });
}

function handleRemoveTeamMember(initials) {
  const currentTeam = project.team ?? [];
  updateProject(project.id, { team: currentTeam.filter((i) => i !== initials) });
}
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
        <div className="flex items-center gap-2">
          {canManage ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setStatusMenuOpen((open) => !open)}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold ${STATUS_STYLES[project.status]}`}
              >
                {project.status}
                <ChevronDown size={14} />
              </button>
              {statusMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setStatusMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-9 z-20 w-36 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    {PROJECT_STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          updateProject(project.id, { status: s });
                          setStatusMenuOpen(false);
                        }}
                        className={`block w-full px-3 py-1.5 text-left text-sm font-medium hover:bg-gray-50 ${
                          s === project.status ? "text-blue-600" : "text-gray-600"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <span
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${STATUS_STYLES[project.status]}`}
            >
              {project.status}
            </span>
          )}

          {canManage && (
            <button
              type="button"
              disabled={deleting}
              onClick={async () => {
                if (!window.confirm(`Delete "${project.name}"? This can't be undone.`)) {
                  return;
                }
                setDeleting(true);
                const { error } = await deleteProject(project.id);
                if (!error) {
                  navigate("/dashboard/projects");
                } else {
                  setDeleting(false);
                }
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
              aria-label="Delete project"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <p className="mb-6 max-w-2xl text-[15px] leading-relaxed text-gray-600">
        {project.description}
      </p>

      <div className="mb-8 grid grid-cols-2 gap-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Tasks
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {doneCount}/{projectTasks.length}
          </p>
          <p className="mt-2 text-xs text-gray-400">completed</p>
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

      <div className="mb-6">
  <div className="mb-2 flex items-center gap-2">
    <Users size={16} className="text-gray-400" />
    <p className="text-sm font-medium text-gray-700">Team</p>
    {canManage && (
      <button
        onClick={() => setTeamModalOpen(true)}
        className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
        aria-label="Add team member"
      >
        <Plus size={13} />
      </button>
    )}
  </div>

  <div className="flex flex-wrap gap-2">
    {(project.team ?? []).length === 0 && (
      <p className="text-sm text-gray-400">No one assigned yet.</p>
    )}
    {(project.team ?? []).map((initials, i) => (
      <div
        key={i}
        className="group/team flex items-center gap-1.5 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-2"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-[10px] font-semibold text-blue-600">
          {initials}
        </div>
        {canManage && (
          <button
            onClick={() => handleRemoveTeamMember(initials)}
            className="text-gray-300 hover:text-red-500"
            aria-label={`Remove ${initials} from team`}
          >
            <XIcon size={13} />
          </button>
        )}
      </div>
    ))}
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
                <div
                  title={task.assignee}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-[10px] font-semibold text-blue-600"
                >
                  {initialsFor(task.assignee)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {teamModalOpen && (
  <AddTeamMemberModal
    project={project}
    onClose={() => setTeamModalOpen(false)}
    onAdd={handleAddTeamMember}
  />
)}
    </div>
  );
}