import { useState } from "react";
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate("/");
  }

  return (
    <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">

      <div className="relative w-96">
        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-5">
        <Bell className="cursor-pointer" />

        <Link to="/dashboard/settings">
          <Settings className="cursor-pointer text-gray-600 hover:text-blue-600" />
        </Link>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-1.5"
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="w-10 h-10 rounded-full"
            />
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-12 z-20 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                  <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">
                    {user?.role}
                  </span>
                </div>

                <Link
                  to="/dashboard/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User size={16} />
                  My Profile
                </Link>

                <Link
                  to="/dashboard/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings size={16} />
                  Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 border-t border-gray-100 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;