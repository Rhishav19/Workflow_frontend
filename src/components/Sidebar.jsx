import {
  LayoutDashboard,
  ChartNoAxesCombined,
  FolderKanban,
  CheckSquare,
  Clock3,
  Users,
  FileText,
  Megaphone,
  UserPlus,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import { useWorkspace } from "../context/WorkspaceContext";

const menus = [
  { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
  { name: "Analytics", icon: <ChartNoAxesCombined size={20} />, path: "/dashboard/analytics" },
  { name: "Projects", icon: <FolderKanban size={20} />, path: "/dashboard/projects" },
  { name: "Tasks", icon: <CheckSquare size={20} />, path: "/dashboard/tasks" },
  { name: "Time Tracking", icon: <Clock3 size={20} />, path: "/dashboard/time-tracking" },
  { name: "Members", icon: <Users size={20} />, path: "/dashboard/members" },
  { name: "Docs", icon: <FileText size={20} />, path: "/dashboard/docs" },
  { name: "Announcements", icon: <Megaphone size={20} />, path: "/dashboard/announcements" },
];

const Sidebar = () => {
  const { currentRole } = useWorkspace();

  const visibleMenus =
    currentRole === "Admin"
      ? [
          ...menus,
          {
            name: "Create Account",
            icon: <UserPlus size={20} />,
            path: "/dashboard/admin/create-account",
          },
        ]
      : menus;

  return (
    <aside className="w-full border-b bg-white shadow-lg lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="border-b p-4 text-2xl font-bold lg:p-6">
        Workflow
      </div>

      <WorkspaceSwitcher />

      <nav className="mt-2 flex overflow-x-auto lg:mt-4 lg:block">
        {visibleMenus.map((menu) => (
          <NavLink
            key={menu.name}
            to={menu.path}
            end={menu.path === "/dashboard"}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-2.5 px-4 py-3 text-sm transition-all lg:gap-3 lg:px-6 lg:py-4 lg:text-base ${
                isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {menu.icon}
            <span>{menu.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
export default Sidebar;
