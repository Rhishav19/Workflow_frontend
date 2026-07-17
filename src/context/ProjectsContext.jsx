import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ProjectsContext = createContext(null);

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
    const channel = supabase
      .channel("projects-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      const mapped = data.map((p) => ({
        id: p.id,
        workspaceId: p.workspace_id,
        name: p.name,
        description: p.description,
        department: p.department,
        status: p.status,
        progress: p.progress,
        dueDate: p.due_date,
        team: p.team ?? [],
        teamOverflow: p.team_overflow,
      }));
      setProjects(mapped);
    }
    setLoading(false);
  }

  async function addProject(project) {
    const { error } = await supabase.from("projects").insert({
      id: project.id,
      workspace_id: project.workspaceId,
      name: project.name,
      description: project.description,
      department: project.department,
      status: project.status,
      progress: project.progress,
      due_date: project.dueDate,
      team: project.team,
      team_overflow: project.teamOverflow,
    });

    if (error) {
      console.error("Error creating project:", error);
      return;
    }

    setProjects((prev) => [project, ...prev]);
  }

  return (
    <ProjectsContext.Provider value={{ projects, addProject, loading }}>
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