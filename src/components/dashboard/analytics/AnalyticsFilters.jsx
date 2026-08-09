import { SlidersHorizontal } from "lucide-react";
import { Select } from "../../ui/select";
import { TIME_RANGES } from "../../../stores/analyticsStore";

export default function AnalyticsFilters({
  departments,
  department,
  timeRange,
  onDepartmentChange,
  onTimeRangeChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
        <SlidersHorizontal size={16} className="text-gray-400" />
        <Select
          value={timeRange}
          onChange={(event) => onTimeRangeChange(event.target.value)}
          aria-label="Analytics time period"
          className="h-8 border-0 px-1 focus:border-0"
        >
          {TIME_RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </Select>
      </div>

      <Select
        value={department}
        onChange={(event) => onDepartmentChange(event.target.value)}
        aria-label="Analytics department"
        className="min-w-[180px]"
      >
        {departments.map((option) => (
          <option key={option} value={option}>
            {option === "All" ? "All departments" : option}
          </option>
        ))}
      </Select>
    </div>
  );
}
