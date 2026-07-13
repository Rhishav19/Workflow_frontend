import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProjectsHeader from "../components/projects/ProjectsHeader";
import ProjectsToolbar from "../components/projects/ProjectsToolbar";
import ProjectsGrid from "../components/projects/ProjectsGrid";
import NewProjectModal from "../components/projects/NewProjectModal";
import { projects as initialProjects } from "../data/projects";
import { useWorkspace } from "../context/WorkspaceContext";

export default function Projects() {
  const { workspaceId } = useWorkspace();
  const [projects, setProjects] = useState(initialProjects);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setModalOpen(true);
      searchParams.delete("new");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const matchesWorkspace = project.workspaceId === workspaceId;
      const matchesFilter = filter === "All" || project.status === filter;
      const matchesQuery =
        query.trim() === "" ||
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.department.toLowerCase().includes(query.toLowerCase());
      return matchesWorkspace && matchesFilter && matchesQuery;
    });
  }, [projects, workspaceId, query, filter]);

  function handleCreate(newProject) {
    setProjects((prev) => [{ ...newProject, workspaceId }, ...prev]);
  }

  return (
    <div className="px-8 py-8">
      <ProjectsHeader onNewProject={() => setModalOpen(true)} />
      <ProjectsToolbar
        query={query}
        onQueryChange={setQuery}
        activeFilter={filter}
        onFilterChange={setFilter}
      />
      <ProjectsGrid projects={filtered} />

      {modalOpen && (
        <NewProjectModal onClose={() => setModalOpen(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}