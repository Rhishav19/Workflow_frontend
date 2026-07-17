export const mockAccounts = [
  {
    email: "alex.rivera@workflow.com",
    password: "Workflow123",
    name: "Alex Rivera",
    mustChangePassword: false,
  },
  {
    email: "sarah.chen@workflow.com",
    password: "Workflow123",
    name: "Sarah Chen",
    mustChangePassword: false,
  },
  {
    email: "new.employee@workflow.com",
    password: "Temp4821",
    name: "New Employee",
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

// Still mock — password/name storage. Real membership creation now
// happens via Supabase in workspaces.js's createAccount-equivalent flow.
export function createAccount({ name, email }) {
  const tempPassword = Math.random().toString(36).slice(-8);
  const existing = mockAccounts.find(
    (acc) => acc.email.toLowerCase() === email.toLowerCase()
  );

  if (existing) {
    return existing.password;
  }

  mockAccounts.push({
    email,
    password: tempPassword,
    name,
    mustChangePassword: true,
  });
  return tempPassword;
}