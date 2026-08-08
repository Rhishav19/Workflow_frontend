import { supabase } from "../lib/supabaseClient";

export async function createNotification({
  workspaceId,
  type,
  message,
  targetRoles = null,
  targetInitials = null,
}) {
  const { error } = await supabase.from("notifications").insert({
    workspace_id: workspaceId,
    type,
    message,
    target_roles: targetRoles,
    target_initials: targetInitials,
  });

  if (error) {
    console.error("Error creating notification:", error);
  }
}