import {
  Plus,
  ClipboardList,
  UserPlus,
} from "lucide-react";

const actions = [
  {
    title: "New Project",
    icon: <Plus size={22} />,
    color: "bg-blue-600",
  },
  {
    title: "Add Task",
    icon: <ClipboardList size={22} />,
    color: "bg-green-600",
  },
  {
    title: "Invite Member",
    icon: <UserPlus size={22} />,
    color: "bg-purple-600",
  },
];

const QuickActions = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">
        Quick Actions
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.title}
            className={`${action.color} text-white rounded-xl p-5 hover:scale-105 transition`}
          >
            <div className="flex justify-center mb-2">
              {action.icon}
            </div>

            <p className="text-sm font-medium">
              {action.title}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;