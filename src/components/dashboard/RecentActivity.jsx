import { Link } from "react-router-dom";
import { useActivity } from "../../context/ActivityContext";
import { useWorkspace } from "../../context/WorkspaceContext";
import { formatRelativeTime } from "../../utils/formattime";
import { initialsFor } from "../../utils/initials";

const RecentActivity = () => {
  const { activities, loading } = useActivity();
  const { workspaceId } = useWorkspace();

  const scoped = activities.filter((a) => a.workspaceId === workspaceId);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Recent Activity</h2>
        <Link to="/dashboard/Activity" className="text-blue-600 font-semibold">
          View All
        </Link>
      </div>

      <div className="space-y-6">
        {loading && (
          <p className="text-sm text-gray-400">Loading…</p>
        )}

        {!loading && scoped.length === 0 && (
          <p className="text-sm text-gray-400">No recent activity yet.</p>
        )}

        {scoped.slice(0, 6).map((activity) => (
          <div key={activity.id} className="flex gap-4 items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {initialsFor(activity.actor)}
            </div>

            <div>
              <p className="text-gray-800">
                <span className="font-bold">{activity.actor}</span>{" "}
                {activity.verb}{" "}
                {activity.target && (
                  <span className="text-blue-600 font-semibold">
                    {activity.target}
                  </span>
                )}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {formatRelativeTime(activity.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;