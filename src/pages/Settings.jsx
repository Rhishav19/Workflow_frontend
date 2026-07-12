import { useState } from "react";
import { User, Bell, Lock, Palette } from "lucide-react";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function SettingsSection({ icon: Icon, title, description, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={19} />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const [name, setName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex.rivera@workflow.com");
  const [savedMessage, setSavedMessage] = useState("");

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  function handleProfileSave(e) {
    e.preventDefault();
    setSavedMessage("Profile updated.");
    setTimeout(() => setSavedMessage(""), 2500);
  }

  return (
    <div className="px-8 py-8">
      <div className="mb-7">
        <h1 className="text-[32px] font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-[15px] text-gray-500">
          Manage your profile, notifications, and account preferences.
        </p>
      </div>

      <div className="flex max-w-2xl flex-col gap-5">
        {/* Profile */}
        <SettingsSection
          icon={User}
          title="Profile"
          description="Your personal information"
        >
          <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
            {savedMessage && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">
                {savedMessage}
              </div>
            )}

            <div className="flex items-center gap-4">
              <img
                src="https://i.pravatar.cc/64"
                alt="profile"
                className="h-16 w-16 rounded-full"
              />
              <button
                type="button"
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Change photo
              </button>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="mt-1 h-10 w-fit rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save changes
            </button>
          </form>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection
          icon={Bell}
          title="Notifications"
          description="Choose what you want to hear about"
        >
          <div className="flex flex-col divide-y divide-gray-100">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Email notifications
                </p>
                <p className="text-xs text-gray-400">
                  Get notified about activity via email
                </p>
              </div>
              <Toggle checked={emailNotifs} onChange={setEmailNotifs} />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Task reminders
                </p>
                <p className="text-xs text-gray-400">
                  Reminders for tasks assigned to you
                </p>
              </div>
              <Toggle checked={taskReminders} onChange={setTaskReminders} />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Weekly digest
                </p>
                <p className="text-xs text-gray-400">
                  A summary of the week every Monday
                </p>
              </div>
              <Toggle checked={weeklyDigest} onChange={setWeeklyDigest} />
            </div>
          </div>
        </SettingsSection>

        {/* Security */}
        <SettingsSection
          icon={Lock}
          title="Security"
          description="Password and account access"
        >
          <button
            type="button"
            className="h-10 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Change password
          </button>
          <p className="mt-2 text-xs text-gray-400">
            Requires backend integration — placeholder for now.
          </p>
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection
          icon={Palette}
          title="Appearance"
          description="Customize how Workflow looks"
        >
          <div className="flex gap-3">
            <button className="rounded-lg border-2 border-blue-600 bg-white px-4 py-2 text-sm font-medium text-gray-900">
              Light
            </button>
            <button
              disabled
              className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400"
            >
              Dark (coming soon)
            </button>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}