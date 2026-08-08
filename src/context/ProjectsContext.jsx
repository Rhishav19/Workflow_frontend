
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";

const ProjectsContext = createContext(null);

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  function mapFromDb(row) {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      department: row.department,
      dueDate: row.due_date,
      team: row.team,
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
      setLoading(false);
      return { error };
    }

    setProjects(data.map(mapFromDb));
    setLoading(false);

    return { error: null };
  }

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

  async function updateProject(projectId, updates) {
    const dbUpdates = {};

    if ("status" in updates) dbUpdates.status = updates.status;
    if ("name" in updates) dbUpdates.name = updates.name;
    if ("description" in updates) {
      dbUpdates.description = updates.description;
    }
    if ("department" in updates) {
      dbUpdates.department = updates.department;
    }
    if ("dueDate" in updates) {
      dbUpdates.due_date = updates.dueDate;
    }
    if ("team" in updates) {
      dbUpdates.team = updates.team;
    }

    const { error } = await supabase
      .from("projects")
      .update(dbUpdates)
      .eq("id", projectId);

    if (error) {
      console.error("Error updating project:", error);
      return { error };
    }

    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? { ...project, ...updates }
          : project
      )
    );

    return { error: null };
  }

  async function deleteProject(projectId) {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      console.error("Error deleting project:", error);
      return { error };
    }

    setProjects((prev) =>
      prev.filter((project) => project.id !== projectId)
    );

    return { error: null };
  }

  const value = {
    projects,
    loading,
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
    throw new Error(
      "useProjects must be used within a ProjectsProvider"
    );
  }

  return context;
}

