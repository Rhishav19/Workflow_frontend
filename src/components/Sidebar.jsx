import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  CalendarDays,
  BarChart3,
  Clock3,
  FileText,
  Megaphone,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menus = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/",
  },
  {
    name: "Projects",
    icon: <FolderKanban size={20} />,
    path: "/projects",
  },
  {
    name: "Tasks",
    icon: <CheckSquare size={20} />,
    path: "/tasks",
  },
  {
    name: "Members",
    icon: <Users size={20} />,
    path: "/members",
  },
  {
    name: "Meetings",
    icon: <CalendarDays size={20} />,
    path: "/meetings",
  },
  {
    name: "Analytics",
    icon: <BarChart3 size={20} />,
    path: "/analytics",
  },
  {
    name: "Time Tracking",
    icon: <Clock3 size={20} />,
    path: "/time-tracking",
  },
  {
    name: "Docs",
    icon: <FileText size={20} />,
    path: "/docs",
  },
  {
    name: "Announcements",
    icon: <Megaphone size={20} />,
    path: "/announcements",
  },
  {
    name: "Settings",
    icon: <Settings size={20} />,
    path: "/settings",
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