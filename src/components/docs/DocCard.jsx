import { FileText, FileSpreadsheet, Trash2 } from "lucide-react";
import { CATEGORY_STYLES } from "../../data/docs";
<<<<<<< HEAD
=======
import { formatRelativeTime } from "../../utils/formattime";
import { hasPermission } from "../../data/permissions";
import { useWorkspace } from "../../context/WorkspaceContext";
import { useAuth } from "../../context/AuthContext";
>>>>>>> 2abe1e6e363d87e6ddee9ff154196098c4821216

export default function DocCard({ doc, onDelete }) {
  const { currentRole } = useWorkspace();
  const { user } = useAuth();
  const Icon = doc.fileType === "Sheet" ? FileSpreadsheet : FileText;

  const canDelete =
    hasPermission(currentRole, "canDeleteDoc") || doc.author === user?.name;

  function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Delete this document? This can't be undone.")) {
      onDelete(doc.id, doc.filePath);
    }
  }

  return (
    <a
      href={doc.fileUrl}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-blue-300"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
          <Icon size={20} />
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${CATEGORY_STYLES[doc.category]}`}
          >
            {doc.category}
          </span>
          {canDelete && (
            <button
              onClick={handleDelete}
              title="Delete document"
              className="text-gray-400 hover:text-red-600"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      <h3 className="mb-1 text-[15px] font-semibold leading-snug text-gray-900">
        {doc.title}
      </h3>
      <p className="text-xs text-gray-400">By {doc.author}</p>

      <div className="mt-auto border-t border-gray-100 pt-3 text-xs text-gray-400">
        Updated {formatRelativeTime(doc.createdAt) || "just now"}
      </div>
    </a>
  );
}