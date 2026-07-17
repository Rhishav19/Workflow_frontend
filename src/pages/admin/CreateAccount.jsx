import { useState } from "react";
import { createAccount } from "../../data/auth";
import { addMembership } from "../../data/workspacesApi";
import { useWorkspace } from "../../context/WorkspaceContext";

export default function CreateAccount() {
  const { workspaceId } = useWorkspace();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Employee");
  const [department, setDepartment] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !department.trim()) {
      setError("All fields are required.");
      return;
    }

    setSubmitting(true);

    const tempPassword = await createAccount({
      name: name.trim(),
      email: email.trim(),
    });

    if (!tempPassword) {
      setSubmitting(false);
      setError("Couldn't create the account. Try again.");
      return;
    }
    await addMembership(email.trim(), workspaceId, role);

    setSubmitting(false);
    setResult({ email, tempPassword });
    setName("");
    setEmail("");
    setDepartment("");
  }

  return (
    <div className="px-8 py-8">
      <div className="mb-7">
        <h1 className="text-[32px] font-bold text-gray-900">Create Account</h1>
        <p className="mt-1 text-[15px] text-gray-500">
          Admin-only. Generates a temporary password for the new user.
        </p>
      </div>

      <div className="max-w-sm rounded-2xl border border-gray-200 bg-white p-6">
        {result && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700">
            Account created for <strong>{result.email}</strong>.<br />
            Temporary password: <code className="font-mono">{result.tempPassword}</code>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
          />
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Department"
            className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
          </select>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 h-10 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Creating…" : "Generate Account"}
          </button>
        </form>
      </div>
    </div>
  );
}