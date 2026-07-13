// Mock account store — replace with real backend calls once ready.
export const mockAccounts = [
  {
    email: "alex.rivera@workflow.com",
    password: "Workflow123",
    name: "Alex Rivera",
    role: "Admin",
    mustChangePassword: false,
  },
  {
    email: "sarah.chen@workflow.com",
    password: "Workflow123",
    name: "Sarah Chen",
    role: "Manager",
    mustChangePassword: false,
  },
  {
    email: "new.employee@workflow.com",
    password: "Temp4821",
    name: "New Employee",
    role: "Employee",
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

// Used by an Admin, from inside the app, to create Employee/Manager accounts.
export function createAccount({ name, email, role, department }) {
  const tempPassword = Math.random().toString(36).slice(-8);
  const account = {
    email,
    password: tempPassword,
    name,
    role,
    department,
    mustChangePassword: true,
  };
  mockAccounts.push(account);
  return tempPassword;
}