import { Clock3 } from "lucide-react";
import { useTasks } from "../context/TasksContext";
import { useProjects } from "../context/ProjectsContext";
import { useWorkspace } from "../context/WorkspaceContext";
import { useTimeTracking } from "../context/TimeTrackingContext";
import { useAuth } from "../context/AuthContext";
import TimerTaskRow from "../components/Timetracking/TimerTaskRow";
import { formatDuration } from "../utils/formatDuration";


export default function TimeTracking() {
  const { workspaceId } = useWorkspace();
  const { user } = useAuth();
  const { tasks } = useTasks();
  const { projects } = useProjects();
  const { entries, startTimer, stopTimer, getActiveEntry, getTotalSecondsForTask } =
    useTimeTracking();

  const workspaceTasks = tasks.filter((t) => t.workspaceId === workspaceId);
  const activeEntry = getActiveEntry();

  const myTotalToday = entries
    .filter(
      (e) =>
        e.userEmail === user?.email &&
        e.durationSeconds != null &&
        new Date(e.startTime).toDateString() === new Date().toDateString()
    )
    .reduce((sum, e) => sum + e.durationSeconds, 0);

  function projectName(projectId) {
    return projects.find((p) => p.id === projectId)?.name ?? "Unknown project";
  }

  function handleStart(task) {
    startTimer({
      workspaceId,
      taskId: task.id,
      projectId: task.projectId,
    });
  }

  // Group tasks by project so the list reads like a timesheet.
  const grouped = workspaceTasks.reduce((acc, task) => {
    const key = task.projectId ?? "none";
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});

  const recentEntries = entries
    .filter((e) => e.workspaceId === workspaceId && e.durationSeconds != null)
    .slice(0, 8);

  return (
    <div className="min-w-0 px-8 py-8">
      <div className="mb-7 flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-gray-900">Time Tracking</h1>
          <p className="mt-1 text-[15px] text-gray-500">
            Start a timer on a task, stop it when you're done.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3">
          <Clock3 size={18} className="text-blue-600" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Logged today
            </p>
            <p className="text-lg font-bold text-gray-900">{formatDuration(myTotalToday)}</p>
          </div>
        </div>
      </div>

      {workspaceTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60 px-6 py-12 text-center">
          <p className="text-sm font-medium text-gray-600">No tasks to track yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([projectId, projectTasks]) => (
            <div key={projectId}>
              <h2 className="mb-3 text-sm font-semibold text-gray-700">
                {projectName(projectId)}
              </h2>
              <div className="flex flex-col gap-2">
                {projectTasks.map((task) => (
                  <TimerTaskRow
                    key={task.id}
                    task={task}
                    projectName={projectName(task.projectId)}
                    activeEntry={activeEntry}
                    isAnotherTaskRunning={!!activeEntry && activeEntry.taskId !== task.id}
                    loggedSeconds={getTotalSecondsForTask(task.id)}
                    onStart={handleStart}
                    onStop={stopTimer}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="mb-3 mt-8 text-sm font-semibold text-gray-700">Recent entries</h2>
      {recentEntries.length === 0 ? (
        <p className="text-sm text-gray-400">No completed entries yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {recentEntries.map((entry) => {
            const task = tasks.find((t) => t.id === entry.taskId);
            return (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-2.5 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-800">
                    {task?.title ?? "Deleted task"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {entry.userName} · {new Date(entry.startTime).toLocaleString()}
                  </p>
                </div>
                <p className="shrink-0 font-mono text-xs font-semibold text-gray-600">
                  {formatDuration(entry.durationSeconds)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}