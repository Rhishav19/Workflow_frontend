import OrgNode from "./OrgNode";

const OrgTree = ({ tree, isAdmin, onEdit }) => {
  if (!tree || tree.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-12 text-center">
        <p className="text-gray-500">No organization data available.</p>
        <p className="text-gray-400 text-sm mt-1">
          {isAdmin
            ? "Add members and set their reporting relationships to build the org chart."
            : "Contact your admin to set up the organization chart."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-8">
      <div className="min-w-max flex justify-center pt-4">
        {tree.map((root) => (
          <OrgNode key={root.id} node={root} isAdmin={isAdmin} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
};

export default OrgTree;