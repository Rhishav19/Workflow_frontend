import { Network, Users } from "lucide-react";
import { useOrgChart } from "../../context/OrgChartContext";

const OrgChartHeader = () => {
  const { members, loading } = useOrgChart();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Network className="w-6 h-6 text-blue-600" />
          Organization Chart
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Visual reporting tree and department hierarchy
        </p>
      </div>

      {!loading && (
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            <strong className="text-gray-800">{members.length}</strong> members
          </span>
        </div>
      )}
    </div>
  );
};

export default OrgChartHeader;