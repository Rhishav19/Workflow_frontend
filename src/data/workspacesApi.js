import { supabase } from "../lib/supabaseClient";

export async function fetchMembershipsForEmail(email) {
  const { data, error } = await supabase
    .from("memberships")
    .select("workspace_id, role, workspaces(id, name, created_by)")
    .eq("email", email.toLowerCase());

  if (error) {
    console.error("Error fetching memberships:", error);
    return [];
  }

  return data.map((row) => ({
    workspaceId: row.workspace_id,
    role: row.role,
    name: row.workspaces?.name,
  }));
}

export async function createWorkspace(name, adminEmail) {
  const id = `ws-${Date.now()}`;

  const { error: wsError } = await supabase
    .from("workspaces")
    .insert({ id, name, created_by: adminEmail });

  if (wsError) {
    console.error("Error creating workspace:", wsError);
    return null;
  }

  const { error: memberError } = await supabase
    .from("memberships")
    .insert({ email: adminEmail.toLowerCase(), workspace_id: id, role: "Admin" });

  if (memberError) {
    console.error("Error creating membership:", memberError);
    return null;
  }

  return { id, name, createdBy: adminEmail };
}

export async function addMembership(email, workspaceId, role) {
  const { error } = await supabase
    .from("memberships")
    .insert({ email: email.toLowerCase(), workspace_id: workspaceId, role });

  if (error) {
    console.error("Error adding membership:", error);
  }
}