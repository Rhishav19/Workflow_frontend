import { useMemo, useState } from "react";
import ProjectsHeader from "../components/projects/ProjectsHeader";
import ProjectsToolbar from "../components/projects/ProjectsToolbar";
import ProjectsGrid from "../components/projects/ProjectsGrid";
import { projects } from "../data/projects";

export default function Projects() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const matchesFilter = filter === "All" || project.status === filter;
      const matchesQuery =
        query.trim() === "" ||
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.department.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  return (
    <div className="px-8 py-8">
      <ProjectsHeader />
      <ProjectsToolbar
        query={query}
        onQueryChange={setQuery}
        activeFilter={filter}
        onFilterChange={setFilter}
      />
      <ProjectsGrid projects={filtered} />
    </div>
  );
}