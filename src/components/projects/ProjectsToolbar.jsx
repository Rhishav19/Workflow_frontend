import { Search } from "lucide-react";
import { projectFilters } from "../../data/projects";

export default function ProjectsToolbar({
  query,
  onQueryChange,
  activeFilter,
  onFilterChange,
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[220px] max-w-sm">
        <Search
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search projects..."
          className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {projectFilters.map((filter) => {
          const active = filter === activeFilter;
          return (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-gray-900 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </div>
  );
}