import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerAdminAccount } from "../data/auth";
import { createWorkspace } from "../data/workspacesApi";
import { useAuth } from "../context/AuthContext";
import { useWorkspace } from "../context/WorkspaceContext";
import { passwordIssues } from "../utils/passwordRules";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { switchWorkspace } = useWorkspace();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !workspaceName.trim()) {
      setError("All fields are required.");
      return;
    }

    const issues = passwordIssues(password);
    if (issues.length > 0) {
      setError(`Password needs ${issues.join(", ")}.`);
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);

    const result = await registerAdminAccount({
      name: name.trim(),
      email: email.trim(),
      password,
    });

    if (!result.ok) {
      setSubmitting(false);
      setError(result.reason);
      return;
    }

    const workspace = await createWorkspace(workspaceName.trim(), result.account.email);
    setSubmitting(false);

    if (!workspace) {
      setError("Account created, but the workspace failed to set up. Try logging in and creating a workspace from settings.");
      return;
    }

    login(result.account);
    switchWorkspace(workspace.id);
    navigate("/dashboard");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <Link to="/" className="mb-1 block text-xl font-bold text-gray-900">
          Workflow
        </Link>
        <p className="mt-1 mb-6 text-sm text-gray-500">
          Create your company workspace. You'll be the Admin.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Your name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Company / workspace name</label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Acme Inc."
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 h-10 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Creating…" : "Create workspace"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}