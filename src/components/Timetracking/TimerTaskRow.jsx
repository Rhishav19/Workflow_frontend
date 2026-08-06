import { useEffect, useState } from "react";
import { Play, Square } from "lucide-react";
import { formatDuration, formatStopwatch } from "../../utils/formatDuration";
import { PRIORITY_STYLES } from "../../data/tasks";

export default function TimerTaskRow({
  task,
  projectName,
  activeEntry,
  isAnotherTaskRunning,
  loggedSeconds,
  onStart,
  onStop,
}) {
  const isRunning = activeEntry?.taskId === task.id;
  const [liveSeconds, setLiveSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    function tick() {
      const elapsed = Math.floor(
        (Date.now() - new Date(activeEntry.startTime).getTime()) / 1000
      );
      setLiveSeconds(elapsed);
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isRunning, activeEntry]);

  return (
    <div
      className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
        isRunning ? "border-blue-200 bg-blue-50/60" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${PRIORITY_STYLES[task.priority]}`}
        >
          {task.priority}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{task.title}</p>
          <p className="truncate text-xs text-gray-400">{projectName}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div className="text-right">
          <p className={`font-mono text-sm font-semibold ${isRunning ? "text-blue-600" : "text-gray-700"}`}>
            {isRunning ? formatStopwatch(liveSeconds) : formatDuration(loggedSeconds)}
          </p>
          <p className="text-[11px] text-gray-400">{isRunning ? "running" : "logged"}</p>
        </div>

        {isRunning ? (
          <button
            onClick={() => onStop(activeEntry.id)}
            className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
          >
            <Square size={12} />
            Stop
          </button>
        ) : (
          <button
            onClick={() => onStart(task)}
            disabled={isAnotherTaskRunning}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Play size={12} />
            Start
          </button>
        )}
      </div>
    </div>
  );
}