const activities = [
  {
    id: 1,
    user: "Sarah Chen",
    action: "updated",
    project: "Project Alpha",
    time: "24 minutes ago",
    department: "Product Design",
  },
  {
    id: 2,
    user: "David Miller",
    action: "completed",
    project: "Task #892",
    time: "2 hours ago",
    department: "Backend Engineering",
  },
  {
    id: 3,
    user: "Alex Rivera",
    action: "created",
    project: "Q4 Revenue Optimization",
    time: "4 hours ago",
    department: "Finance",
  },
];

const RecentActivity = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          Recent Activity
        </h2>

        <button className="text-blue-600 font-semibold">
          View All
        </button>
      </div>

      <div className="space-y-6">

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

            <div>

              <p className="text-gray-800">
                <span className="font-bold">
                  {activity.user}
                </span>{" "}
                {activity.action}{" "}
                <span className="text-blue-600 font-semibold">
                  {activity.project}
                </span>
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {activity.time} • {activity.department}
              </p>

            </div>
          </div>

        ))}

      </div>

    </div>
  );
};

export default RecentActivity;