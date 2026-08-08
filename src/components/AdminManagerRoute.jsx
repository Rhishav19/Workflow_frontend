import { Navigate, Outlet } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";

export default function AdminManagerRoute() {
  const { currentRole, loading } = useWorkspace();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading…
      </div>
    );
  }

  if (currentRole !== "Admin" && currentRole !== "Manager") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}