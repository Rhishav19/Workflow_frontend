const DepartmentLegend = ({ members }) => {
  const departments = Array.from(
    new Map(
      members
        .filter((m) => m.department)
        .map((m) => [m.department, { name: m.department, color: m.departmentColor }])
    ).values()
  );

  if (departments.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Departments</h3>
      <div className="flex flex-wrap gap-2">
        {departments.map((dept) => (
          <div
            key={dept.name}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: dept.color + "15",
              color: dept.color,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: dept.color }}
            />
            {dept.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentLegend;