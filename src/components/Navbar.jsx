import {
  Bell,
  Search,
  Settings,
} from "lucide-react";

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">

      <div className="relative w-96">

        <Search
          size={18}
          className="absolute left-3 top-3 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      <div className="flex items-center gap-5">

        <Bell className="cursor-pointer" />

        <Settings className="cursor-pointer" />

        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          className="w-10 h-10 rounded-full"
        />

      </div>

    </header>
  );
};

export default Navbar;