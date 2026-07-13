import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  FileText,
  Megaphone,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menus = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/dashboard",
  },
  {
    name: "Projects",
    icon: <FolderKanban size={20} />,
    path: "/dashboard/projects",
  },
  {
    name: "Tasks",
    icon: <CheckSquare size={20} />,
    path: "/dashboard/tasks",
  },
  {
    name: "Members",
    icon: <Users size={20} />,
    path: "/dashboard/members",
  },
  {
    name: "Docs",
    icon: <FileText size={20} />,
    path: "/dashboard/docs",
  },
  {
    name: "Announcements",
    icon: <Megaphone size={20} />,
    path: "/dashboard/announcements",
  },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-lg border-r">

      <div className="text-2xl font-bold p-6 border-b">
        Workflow
      </div>

      <nav className="mt-4">

        {menus.map((menu) => (

          <NavLink
            key={menu.name}
            to={menu.path}
            end={menu.path === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-4 transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
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