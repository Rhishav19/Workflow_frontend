import { useState } from "react";
import { X } from "lucide-react";
import { accountExists } from "../../data/auth";
import { useWorkspace } from "../../context/WorkspaceContext";

const ROLE_OPTIONS = ["Manager", "Employee"];

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function MemberModal({ member, onClose, onSave }) {
  const isEditing = Boolean(member);
  const { workspaceId } = useWorkspace();

  const [name, setName] = useState(member?.name ?? "");
  const [email, setEmail] = useState(member?.email ?? "");
  const [department, setDepartment] = useState(member?.department ?? "");
  const [role, setRole] = useState(member?.role ?? "Employee");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !department.trim()) {
      setError("Name, email, and department are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    if (isEditing) {
      onSave({
        id: member.id,
        workspaceId: member.workspaceId,
        name: name.trim(),
        initials: getInitials(name),
        email: email.trim(),
        department: department.trim(),
        role,
        joinedDate: member.joinedDate,
      });
      onClose();
      return;
    }

    // Adding a new member: this only links an existing account into the
    // workspace. Accounts are created separately (e.g. via Admin > Create
    // Account) — if there's no account for this email yet, refuse to add
    // them rather than inventing a member with nothing behind it.
    setSubmitting(true);
    const exists = await accountExists(email.trim());
    setSubmitting(false);

    if (!exists) {
      setNotFound(true);
      return;
    }

    onSave({
      id: `mem-${Date.now()}`,
      workspaceId,
      name: name.trim(),
      initials: getInitials(name),
      email: email.trim(),
      department: department.trim(),
      role,
      joinedDate: "Just now",
    });

    onClose();
  }

  if (notFound) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Member does not exist
          </h2>
          <p className="mb-5 text-sm text-gray-500">
            There's no account for <strong>{email.trim()}</strong> yet. Create
            an account for this person first, then add them as a member.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setNotFound(false)}
              className="h-10 flex-1 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={onClose}
              className="h-10 flex-1 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Member" : "Add Member"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          {!isEditing && (
            <p className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-2.5 text-xs text-blue-700">
              This person needs an account before they can be added. If they
              don't have one yet, create it from Admin → Create Account first.
            </p>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@workflow.com"
              disabled={isEditing}
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Product Design"
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg px-4 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Checking…" : isEditing ? "Save Changes" : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}