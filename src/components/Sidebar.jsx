import {
  LayoutDashboard,
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
import { Sitemap } from "lucide-react";

const menus = [
  { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
  { name: "Projects", icon: <FolderKanban size={20} />, path: "/dashboard/projects" },
  { name: "Tasks", icon: <CheckSquare size={20} />, path: "/dashboard/tasks" },
  { name: "Time Tracking", icon: <Clock3 size={20} />, path: "/dashboard/time-tracking" },
  { name: "Members", icon: <Users size={20} />, path: "/dashboard/members" },
  { name: "Docs", icon: <FileText size={20} />, path: "/dashboard/docs" },
  { name: "Announcements", icon: <Megaphone size={20} />, path: "/dashboard/announcements" },
  { name: "Org Chart", icon: <Sitemap />, path: "/dashboard/org-chart" },
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
    <aside className="w-64 bg-white shadow-lg border-r">
      <div className="text-2xl font-bold p-6 border-b">
        Workflow
      </div>

      <WorkspaceSwitcher />

      <nav className="mt-4">
        {visibleMenus.map((menu) => (
          <NavLink
            key={menu.name}
            to={menu.path}
            end={menu.path === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-4 transition-all ${
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