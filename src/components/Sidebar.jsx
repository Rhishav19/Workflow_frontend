import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Clock3,
  Users,
  FileText,
  Megaphone,
  UserPlus,
  Wallet,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import { useWorkspace } from "../context/WorkspaceContext";

const menus = [
  { name: "Dashboard", icon: <LayoutDashboard />, path: "/dashboard" },
  { name: "Projects", icon: <FolderKanban />, path: "/dashboard/projects" },
  { name: "Tasks", icon: <CheckSquare />, path: "/dashboard/tasks" },
  { name: "Time Tracking", icon: <Clock3 />, path: "/dashboard/time-tracking" },
  { name: "Members", icon: <Users />, path: "/dashboard/members" },
  { name: "Docs", icon: <FileText />, path: "/dashboard/docs" },
  { name: "Announcements", icon: <Megaphone />, path: "/dashboard/announcements" },
];

const Sidebar = () => {
  const { currentRole } = useWorkspace();

  const isAdminOrManager = currentRole === "Admin" || currentRole === "Manager";

  const visibleMenus = [
    ...menus,
    ...(isAdminOrManager
      ? [{ name: "Budget", icon: <Wallet />, path: "/dashboard/budget" }]
      : []),
    ...(currentRole === "Admin"
      ? [
          {
            name: "Create Account",
            icon: <UserPlus />,
            path: "/dashboard/admin/create-account",
          },
        ]
      : []),
  ];

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col p-4">
      <div className="mb-8">
        <WorkspaceSwitcher />
      </div>

      <nav className="flex-1 space-y-2">
        {visibleMenus.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? "text-white" : "text-gray-400"}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;