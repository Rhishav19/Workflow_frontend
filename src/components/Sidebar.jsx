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
  Wallet,
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
  const isAdminOrManager = currentRole === "Admin" || currentRole === "Manager";

  const visibleMenus = [
    ...menus,
    ...(isAdminOrManager
      ? [{ name: "Budget", icon: <Wallet size={20} />, path: "/dashboard/budget" }]
      : []),
    ...(currentRole === "Admin"
      ? [
          {
            name: "Create Account",
            icon: <UserPlus size={20} />,
            path: "/dashboard/admin/create-account",
          },
        ]
      : []),
  ];

  return (
    <aside className="w-full border-b bg-white shadow-lg lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="border-b p-4 text-2xl font-bold lg:p-6">
        Workflow
      </div>
      <WorkspaceSwitcher />
      <nav className="mt-2 flex overflow-x-auto lg:mt-4 lg:block lg:space-y-2 lg:px-2">
        {visibleMenus.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all lg:gap-3 lg:rounded-xl lg:px-4 lg:py-3 lg:text-base ${
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
    </aside>
  );
};

export default Sidebar;
