import { Link } from "react-router-dom";
import { useActivity } from "../../context/ActivityContext";
import { useWorkspace } from "../../context/WorkspaceContext";
import { formatRelativeTime } from "../../utils/formattime";
import { initialsFor } from "../../utils/initials";

const RecentActivity = () => {
  const { workspaceId } = useWorkspace();
  const { activity } = useActivity();

  const recent = activity.filter((a) => a.workspaceId === workspaceId).slice(0, 6);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Recent Activity</h2>

        <Link to="/dashboard/tasks" className="text-blue-600 font-semibold">
          View All
        </Link>
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-gray-500">No recent activity yet.</p>
      ) : (
        <div className="space-y-6">
          {recent.map((entry) => (
            <div key={entry.id} className="flex gap-4 items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                {initialsFor(entry.actor)}
              </div>

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
      )}
    </div>
  );
};

export default RecentActivity;