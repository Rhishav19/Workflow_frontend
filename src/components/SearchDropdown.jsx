import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, FolderKanban, CheckSquare, Users, X } from "lucide-react";
import { useProjects } from "../context/ProjectsContext";
import { useTasks } from "../context/TasksContext";
import { useWorkspace } from "../context/WorkspaceContext";
import { members } from "../data/members";

export default function SearchDropdown() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const { workspaceId } = useWorkspace();
  const { projects } = useProjects();
  const { tasks } = useTasks();

  const q = query.trim().toLowerCase();

  const matchedProjects =
    q.length > 0
      ? projects
          .filter((p) => p.workspaceId === workspaceId)
          .filter((p) => p.name.toLowerCase().includes(q))
          .slice(0, 4)
      : [];

  const matchedTasks =
    q.length > 0
      ? tasks
          .filter((t) => t.workspaceId === workspaceId)
          .filter((t) => t.title.toLowerCase().includes(q))
          .slice(0, 4)
      : [];

  const matchedMembers =
    q.length > 0
      ? members
          .filter((m) => m.workspaceId === workspaceId)
          .filter((m) => m.name.toLowerCase().includes(q))
          .slice(0, 4)
      : [];

  const hasResults =
    matchedProjects.length > 0 || matchedTasks.length > 0 || matchedMembers.length > 0;

  useEffect(() => {
    function handleClickOutside(e) {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function clear() {
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={inputRef} className="relative w-96">
      <Search size={18} className="absolute left-3 top-3 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search..."
        className="w-full pl-10 pr-9 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
      />
      {query && (
        <button
          onClick={clear}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      )}

      {open && q.length > 0 && (
        <div className="absolute left-0 right-0 top-12 z-30 max-h-96 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {!hasResults && (
            <p className="px-4 py-6 text-center text-sm text-gray-400">
              No results for "{query}"
            </p>
          )}

          {matchedProjects.length > 0 && (
            <div className="border-b border-gray-100 py-2">
              <p className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Projects
              </p>
              {matchedProjects.map((p) => (
                <Link
                  key={p.id}
                  to={`/dashboard/projects/${p.id}`}
                  onClick={clear}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <FolderKanban size={15} className="text-blue-600" />
                  {p.name}
                </Link>
              ))}
            </div>
          )}

          {matchedTasks.length > 0 && (
            <div className="border-b border-gray-100 py-2">
              <p className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Tasks
              </p>
              {matchedTasks.map((t) => (
                <Link
                  key={t.id}
                  to="/dashboard/tasks"
                  onClick={clear}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <CheckSquare size={15} className="text-emerald-600" />
                  {t.title}
                </Link>
              ))}
            </div>
          )}

          {matchedMembers.length > 0 && (
            <div className="py-2">
              <p className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Members
              </p>
              {matchedMembers.map((m) => (
                <Link
                  key={m.id}
                  to="/dashboard/members"
                  onClick={clear}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <Users size={15} className="text-purple-600" />
                  {m.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}