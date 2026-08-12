import { ChevronDown, ChevronUp, User, Briefcase, Palette } from "lucide-react";
import { useState } from "react";

const OrgNode = ({ node, depth = 0, isAdmin, onEdit }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div
        className="relative bg-white rounded-2xl shadow-md border-2 p-4 w-56 hover:shadow-lg transition cursor-pointer group"
        style={{ borderColor: node.departmentColor }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {/* Department color strip */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl"
          style={{ backgroundColor: node.departmentColor }}
        />

        {/* Avatar */}
        <div className="flex justify-center mb-3">
          {node.avatarUrl ? (
            <img
              src={node.avatarUrl}
              alt={node.name}
              className="w-14 h-14 rounded-full object-cover border-2"
              style={{ borderColor: node.departmentColor }}
            />
          ) : (
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold"
              style={{ backgroundColor: node.departmentColor }}
            >
              {node.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="text-center">
          <h4 className="font-bold text-gray-800 text-sm truncate">{node.name}</h4>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center justify-center gap-1">
            <Briefcase className="w-3 h-3" />
            {node.position}
          </p>
          <span
            className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full text-white font-medium"
            style={{ backgroundColor: node.departmentColor }}
          >
            {node.department || "General"}
          </span>
        </div>

        {/* Expand/collapse indicator */}
        {hasChildren && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white border rounded-full p-0.5 shadow-sm">
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            )}
          </div>
        )}

        {/* Admin edit button */}
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(node);
            }}
            className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition opacity-0 group-hover:opacity-100"
            title="Edit reporting"
          >
            <Palette className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Connector line down */}
      {hasChildren && expanded && (
        <div className="w-px h-6 bg-gray-300 mt-3" />
      )}

      {/* Children */}
      {hasChildren && expanded && (
        <div className="flex gap-8 mt-0">
          {node.children.map((child) => (
            <div key={child.id} className="flex flex-col items-center">
              {/* Horizontal connector */}
              <div className="w-full h-px bg-gray-300 mb-6 relative">
                <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-px h-6 bg-gray-300" />
              </div>
              <OrgNode
                node={child}
                depth={depth + 1}
                isAdmin={isAdmin}
                onEdit={onEdit}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgNode;