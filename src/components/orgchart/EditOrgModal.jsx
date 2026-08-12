import { useState, useEffect } from "react";
import { X, Users } from "lucide-react";
import { useOrgChart } from "../../context/OrgChartContext";

const EditOrgModal = ({ member, onClose }) => {
  const { members, updateReporting } = useOrgChart();
  const [reportsTo, setReportsTo] = useState(member?.reportsTo || "");
  const [position, setPosition] = useState(member?.position || "");
  const [department, setDepartment] = useState(member?.department || "");
  const [departmentColor, setDepartmentColor] = useState(
    member?.departmentColor || "#3b82f6"
  );
  const [saving, setSaving] = useState(false);

  const departmentColors = [
    { name: "Engineering", color: "#3b82f6" },
    { name: "Marketing", color: "#ec4899" },
    { name: "Sales", color: "#10b981" },
    { name: "HR", color: "#8b5cf6" },
    { name: "Finance", color: "#f59e0b" },
    { name: "Operations", color: "#f97316" },
    { name: "Executive", color: "#1e293b" },
    { name: "Design", color: "#06b6d4" },
  ];

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await updateReporting(member.id, {
      reportsTo: reportsTo || null,
      position,
      department,
      departmentColor,
    });
    setSaving(false);
    onClose();
  }

  // Can't report to self
  const eligibleManagers = members.filter((m) => m.id !== member.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          type="button"
        >
          <X className="w-5 h-5" />
n        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-1">Edit Member</h2>
        <p className="text-gray-500 text-sm mb-6">
          Update reporting relationship and department for <strong>{member.name}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position / Title
            </label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g. Senior Developer"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Engineering"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reports To
            </label>
            <select
              value={reportsTo}
              onChange={(e) => setReportsTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No Manager (Top Level)</option>
              {eligibleManagers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.position}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {departmentColors.map((dc) => (
                <button
                  key={dc.color}
                  type="button"
                  onClick={() => {
                    setDepartmentColor(dc.color);
                    setDepartment(dc.name);
                  }}
                  className={`flex items-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium border-2 transition ${
                    departmentColor === dc.color
                      ? "border-gray-800"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  style={{ backgroundColor: dc.color + "20", color: dc.color }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: dc.color }}
                  />
                  {dc.name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Member"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditOrgModal;