import { Navigate, Outlet } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";

// Guards Admin-only routes (currently just /dashboard/admin/create-account).
// Before this existed, any logged-in Employee or Manager could open that URL
// directly and create accounts — role was never actually checked.
export default function AdminRoute() {
  const { currentRole, loading } = useWorkspace();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-20 text-sm text-gray-400">
        Loading…
      </div>
    );
  }

  if (currentRole !== "Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}