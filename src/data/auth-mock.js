export const mockAccounts = [
  {
    email: "alex.rivera@workflow.com",
    password: "Workflow123",
    name: "Alex Rivera",
    memberships: [{ workspaceId: "ws-1", role: "Admin" }],
    mustChangePassword: false,
  },
  {
    email: "sarahchen@gmail.com",
    password: "Workflow123",
    name: "Sarah Chen",
    memberships: [{ workspaceId: "ws-1", role: "Manager" }],
    mustChangePassword: false,
  },
  {
    email: "new.employee@workflow.com",
    password: "Temp4821",
    name: "New Employee",
    memberships: [{ workspaceId: "ws-1", role: "Employee" }],
    mustChangePassword: true,
  },
];

export function findAccount(email, password) {
  return mockAccounts.find(
    (acc) =>
      acc.email.toLowerCase() === email.trim().toLowerCase() &&
      acc.password === password
  );
}

export function updatePassword(email, newPassword) {
  const account = mockAccounts.find(
    (acc) => acc.email.toLowerCase() === email.toLowerCase()
  );
  if (account) {
    account.password = newPassword;
    account.mustChangePassword = false;
  }
}

export function createAccount({ name, email, role, department, workspaceId }) {
  const tempPassword = Math.random().toString(36).slice(-8);
  const existing = mockAccounts.find(
    (acc) => acc.email.toLowerCase() === email.toLowerCase()
  );

  if (existing) {
    existing.memberships.push({ workspaceId, role });
    return existing.password;
  }

  const account = {
    email,
    password: tempPassword,
    name,
    department,
    memberships: [{ workspaceId, role }],
    mustChangePassword: true,
  };
  mockAccounts.push(account);
  return tempPassword;
}

export function addMembership(email, workspaceId, role) {
  const account = mockAccounts.find(
    (acc) => acc.email.toLowerCase() === email.toLowerCase()
  );
  if (account) {
    account.memberships.push({ workspaceId, role });
  }
}