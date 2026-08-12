<<<<<<< HEAD

import { initialsFor } from "../../utils/initials";

const RecentActivity = () => {
  const { activities } = useActivity();

  return (
    <div>
=======
import { Link } from "react-router-dom";
import { useActivity } from "../../context/ActivityContext";
import { useWorkspace } from "../../context/WorkspaceContext";
import { formatRelativeTime } from "../../utils/formattime";
import { initialsFor } from "../../utils/initials";

const RecentActivity = () => {
  const { workspaceId } = useWorkspace();
  const { activities, loading } = useActivity();

  const scoped = activities
    .filter((a) => a.workspaceId === workspaceId)
    .slice(0, 6);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
>>>>>>> 2abe1e6e363d87e6ddee9ff154196098c4821216
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Recent Activity</h2>

        <Link to="/dashboard/Activity" className="text-blue-600 font-semibold">
          View All
        </Link>
      </div>

      <div className="space-y-6">
<<<<<<< HEAD
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex gap-4 items-start"
          >
            <img
              src={`https://i.pravatar.cc/50?img=${activity.id + 10}`}
              alt=""
              className="w-12 h-12 rounded-full"
            />
=======
        {loading && <p className="text-sm text-gray-400">Loading…</p>}

        {!loading && scoped.length === 0 && (
          <p className="text-sm text-gray-500">No recent activity yet.</p>
        )}

        {scoped.map((entry) => (
          <div key={entry.id} className="flex gap-4 items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
              {initialsFor(entry.actor)}
            </div>
>>>>>>> 2abe1e6e363d87e6ddee9ff154196098c4821216

            <div>
              <p className="text-gray-800">
                <span className="font-bold">{entry.actor}</span>{" "}
                {entry.verb}
                {entry.target && (
                  <>
                    {" "}
                    <span className="text-blue-600 font-semibold">{entry.target}</span>
                  </>
                )}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {formatRelativeTime(entry.createdAt) || "Just now"}
                {entry.project ? ` • ${entry.project}` : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;