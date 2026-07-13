import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { findAccount } from "../data/auth-mock";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "Employee";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const account = findAccount(email, password);
    if (!account) {
      setError("Incorrect email or password.");
      return;
    }

    if (account.role !== role) {
      setError(`This account is registered as ${account.role}, not ${role}.`);
      return;
    }

    if (account.mustChangePassword) {
      navigate("/change-password", { state: { email: account.email } });
      return;
    }

    login(account);
    navigate("/dashboard");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <Link to="/" className="mb-1 block text-xl font-bold text-gray-900">
          Workflow
        </Link>
        <p className="mt-1 mb-6 text-sm text-gray-500">
          Signing in as <span className="font-medium text-gray-700">{role}</span>.{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Not you?
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="you@workflow.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="mt-2 h-10 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}