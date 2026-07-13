import { Link } from "react-router-dom";
import { LayoutDashboard, User, Users, ShieldCheck } from "lucide-react";

const ROLES = [
  {
    role: "Employee",
    icon: User,
    description: "View your tasks, projects, and team updates.",
  },
  {
    role: "Manager",
    icon: Users,
    description: "Manage projects, tasks, and your team's work.",
  },
  {
    role: "Admin",
    icon: ShieldCheck,
    description: "Full access, plus the ability to create accounts.",
  },
];

export default function Landing() {
  return (
    <div className="flex min-h-dvh flex-col items-center bg-gray-50 px-4 py-16">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <LayoutDashboard size={18} />
        </div>
        <span className="text-xl font-bold text-gray-900">Workflow</span>
      </div>

      <h1 className="mt-6 text-3xl font-bold text-gray-900">
        Sign in as
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Choose your role to continue.
      </p>

      <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-3">
        {ROLES.map(({ role, icon: Icon, description }) => (
          <Link
            key={role}
            to={`/login?role=${role}`}
            className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-7 text-center transition-colors hover:border-blue-300 hover:shadow-sm"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Icon size={26} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{role}</h2>
            <p className="mt-1.5 text-sm text-gray-500">{description}</p>
          </Link>
        ))}
      </div>

      <p className="mt-10 max-w-md text-center text-xs text-gray-400">
        Employee and Manager accounts are created by an Admin. If you don't
        have login details yet, contact your admin.
      </p>
    </div>
  );
}