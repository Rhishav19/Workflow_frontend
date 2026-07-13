export let workspaces = [
  { id: "ws-1", name: "Acme Inc.", createdBy: "alex.rivera@workflow.com" },
];

export function createWorkspace(name, adminEmail) {
  const workspace = {
    id: `ws-${Date.now()}`,
    name,
    createdBy: adminEmail,
  };
  workspaces.push(workspace);
  return workspace;
}

export function getWorkspaceById(id) {
  return workspaces.find((w) => w.id === id);
}