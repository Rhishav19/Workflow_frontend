import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { findAccount, updatePassword } from "../data/auth-mock";
import { useAuth } from "../context/AuthContext";
import { useWorkspace } from "../context/WorkspaceContext";

function passwordIssues(value) {
  const issues = [];
  if (value.length < 8) issues.push("at least 8 characters");
  if (!/[A-Z]/.test(value)) issues.push("one uppercase letter");
  if (!/[0-9]/.test(value)) issues.push("one number");
  return issues;
}

export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { switchWorkspace } = useWorkspace();
  const email = location.state?.email;
  const role = location.state?.role;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  if (!email) {
    navigate("/login");
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const issues = passwordIssues(password);
    if (issues.length > 0) {
      setError(`Password needs ${issues.join(", ")}.`);
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    updatePassword(email, password);
    const account = findAccount(email, password);
    login(account);

    const matchingMembership =
      account.memberships.find((m) => m.role === role) ?? account.memberships[0];
    switchWorkspace(matchingMembership.workspaceId);

    navigate("/dashboard");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Set a new password</h1>
        <p className="mt-1 mb-6 text-sm text-gray-500">
          This is your first login. Choose a permanent password for {email}.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              New password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="mt-2 h-10 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save and continue
          </button>
        </form>
      </div>
    </main>
  );
}