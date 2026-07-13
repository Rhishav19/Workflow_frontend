import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { hasPermission } from "../../data/permissions";

const DashboardHeader = () => {
  const { user } = useAuth();
  const canCreate = hasPermission(user?.role, "canCreateProject");

  return (
    <div className="flex justify-between items-center mb-8">

      <div>

        <h1 className="text-4xl font-bold text-gray-800">
          Welcome Back 👋
        </h1>

        <p className="text-gray-500 mt-2">
          Here's what's happening with your projects today.
        </p>

      </div>

      {canCreate && (
        <Link
          to="/dashboard/projects?new=true"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          + Create New
        </Link>
      )}

    </div>
  );
};

export default DashboardHeader;