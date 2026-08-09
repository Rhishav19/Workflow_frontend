export const PERMISSIONS = {
  canCreateProject: ["Admin", "Manager"],
  canCreateTask: ["Admin", "Manager"],
  canAddMember: ["Admin"],
  canRemoveMember: ["Admin", "Manager"],
  canReviewTask: ["Admin", "Manager"],
  canCreateAnnouncement: ["Admin", "Manager"],
  canDeleteAnnouncement: ["Admin", "Manager"],
  canDeleteDoc: ["Admin", "Manager"],
  canSubmitTask: ["Employee"],
  canDeleteTask: ["Admin", "Manager"],
  canManageProject: ["Admin", "Manager"]
};

export function hasPermission(role, permission) {
  return PERMISSIONS[permission]?.includes(role) ?? false;
}

const EMPLOYEE_FREE_COLUMNS = ["To Do", "In Progress"];

export function canMoveTask(role, fromStatus, toStatus) {
  if (fromStatus === toStatus) return true;
  if (hasPermission(role, "canReviewTask")) return true;
  return (
    EMPLOYEE_FREE_COLUMNS.includes(fromStatus) &&
    EMPLOYEE_FREE_COLUMNS.includes(toStatus)
  );
}