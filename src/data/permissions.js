export const PERMISSIONS = {
  canCreateProject: ["Admin", "Manager"],
  canCreateTask: ["Admin", "Manager"],
  canAddMember: ["Admin"],
  canReviewTask: ["Admin", "Manager"],
  canCreateAnnouncement: ["Admin", "Manager"],
  canSubmitTask: ["Employee"],
};

export function hasPermission(role, permission) {
  return PERMISSIONS[permission]?.includes(role) ?? false;
}