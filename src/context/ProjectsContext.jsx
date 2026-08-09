import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ProjectsContext = createContext(null);

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function mapFromDb(row) {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      department: row.department,
      dueDate: row.due_date,
      team: row.team,
      teamOverflow: row.team_overflow,
      progress: row.progress,
      status: row.status,
      workspaceId: row.workspace_id,
      createdAt: row.created_at,
    };
  }

  async function fetchProjects() {
    setLoading(true);

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      setError(error.message);
      setLoading(false);
      return { error };
    }

    setProjects(data.map(mapFromDb));
    setError(null);
    setLoading(false);

    return { error: null };
  }

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

  async function addProject(newProject) {
    const dbProject = {
      id: crypto.randomUUID(),
      name: newProject.name,
      description: newProject.description ?? null,
      department: newProject.department ?? null,
      due_date: newProject.dueDate ?? null,
      team: newProject.team ?? null,
      status: newProject.status ?? "Active",
      workspace_id: newProject.workspaceId,
    };

    const { data, error } = await supabase
      .from("projects")
      .insert(dbProject)
      .select()
      .single();

    if (error) {
      console.error("Error creating project:", error);
      return { error };
    }

    const project = mapFromDb(data);

    setProjects((prev) => [project, ...prev]);

    return {
      error: null,
      project,
    };
  }

  // updates is a partial object like { status: "At Risk" } or { name: "..." }
  async function updateProject(projectId, updates) {
    const dbUpdates = {};
    if ("name" in updates) dbUpdates.name = updates.name;
    if ("description" in updates) dbUpdates.description = updates.description;
    if ("department" in updates) dbUpdates.department = updates.department;
    if ("status" in updates) dbUpdates.status = updates.status;
    if ("progress" in updates) dbUpdates.progress = updates.progress;
    if ("dueDate" in updates) dbUpdates.due_date = updates.dueDate;
    if ("team" in updates) dbUpdates.team = updates.team;
    if ("teamOverflow" in updates) dbUpdates.team_overflow = updates.teamOverflow;

    const { error } = await supabase
      .from("projects")
      .update(dbUpdates)
      .eq("id", projectId);

    if (error) {
      console.error("Error updating project:", error);
      return { error };
    }

    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, ...updates } : p))
    );
    return { error: null };
  }

  async function deleteProject(projectId) {
    const { error } = await supabase.from("projects").delete().eq("id", projectId);

    if (error) {
      console.error("Error deleting project:", error);
      return { error };
    }

    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    return { error: null };
  }

  const value = {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
  };

  return (
    <ProjectsContext.Provider value={value}>
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
