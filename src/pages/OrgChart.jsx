import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useOrgChart } from "../context/OrgChartContext";
import OrgChartHeader from "../components/orgchart/OrgChartHeader";
import OrgTree from "../components/orgchart/OrgTree";
import DepartmentLegend from "../components/orgchart/DepartmentLegend";
import EditOrgModal from "../components/orgchart/EditOrgModal";

export default function OrgChart() {
  const { user } = useAuth();
  const { visibleTree, members, loading } = useOrgChart();
  const [editMember, setEditMember] = useState(null);

  const isAdmin = user?.role === "Admin";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        Loading organization data…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrgChartHeader />

      <DepartmentLegend members={members} />

      {isAdmin && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 flex items-center gap-2">
          <span className="font-semibold">Admin Mode:</span>
          Click any member card to edit their reporting relationship, position, or department color.
        </div>
      )}

      <OrgTree
        tree={visibleTree}
        isAdmin={isAdmin}
        onEdit={(member) => isAdmin && setEditMember(member)}
      />

      {editMember && (
        <EditOrgModal member={editMember} onClose={() => setEditMember(null)} />
      )}
    </div>
  );
}