import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useActivity } from "../context/ActivityContext";
import { useWorkspace } from "../context/WorkspaceContext";
import { formatRelativeTime } from "../utils/formattime";
import { initialsFor } from "../utils/initials";

export default function Activity() {
  const { activities, loading } = useActivity();
  const { workspaceId } = useWorkspace();
  const [query, setQuery] = useState("");

  const scoped = activities
    .filter((a) => a.workspaceId === workspaceId)
    .filter((a) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        a.actor.toLowerCase().includes(q) ||
        a.verb.toLowerCase().includes(q) ||
        (a.target ?? "").toLowerCase().includes(q)
      );
    });

  return (
    <div className="px-8 py-8">
      <Link
        to="/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity</h1>
          <p className="mt-1 text-sm text-gray-500">
            Everything happening across this workspace.
          </p>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search activity…"
          className="h-10 w-64 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white">
        {loading && (
          <p className="px-6 py-8 text-sm text-gray-400">Loading…</p>
        )}

        {!loading && scoped.length === 0 && (
          <p className="px-6 py-8 text-sm text-gray-400">
            {query ? "No matching activity." : "No activity yet."}
          </p>
        )}

        {!loading &&
          scoped.map((activity, i) => (
            <div
              key={activity.id}
              className={`flex items-start gap-4 px-6 py-4 ${
                i !== scoped.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                {initialsFor(activity.actor)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">{activity.actor}</span>{" "}
                  {activity.verb}{" "}
                  {activity.target && (
                    <span className="font-semibold text-blue-600">
                      {activity.target}
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {formatRelativeTime(activity.createdAt)}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}