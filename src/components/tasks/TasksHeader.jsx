import { Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { hasPermission } from "../../data/permissions";

export default function TasksHeader({ onNewTask }) {
  const { user } = useAuth();
  const canCreate = hasPermission(user?.role, "canCreateTask");

  return (
    <div className="mb-7 flex items-start justify-between">
      <div>
        <h1 className="text-[32px] font-bold text-gray-900">Tasks</h1>
        <p className="mt-1 text-[15px] text-gray-500">
          Drag cards between columns to update their status.
        </p>
      </div>
      {canCreate && (
        <button
          onClick={onNewTask}
          className="flex h-11 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-[15px] font-medium text-white hover:bg-blue-700"
        >
          <Plus size={17} />
          New Task
        </button>
      )}
    </div>
  );
}