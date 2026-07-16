import { createContext, useContext, useState } from "react";
import { projects as seedProjects } from "../data/projects";

const ProjectsContext = createContext(null);

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState(seedProjects);

  function addProject(project) {
    setProjects((prev) => [project, ...prev]);
  }

  return (
    <ProjectsContext.Provider value={{ projects, addProject }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}