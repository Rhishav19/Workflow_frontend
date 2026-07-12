import { FileText, FileSpreadsheet } from "lucide-react";
import { CATEGORY_STYLES } from "../../data/docs";

export default function DocCard({ doc }) {
  const Icon = doc.fileType === "Sheet" ? FileSpreadsheet : FileText;

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-blue-300">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
          <Icon size={20} />
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${CATEGORY_STYLES[doc.category]}`}
        >
          {doc.category}
        </span>
      </div>

      <h3 className="mb-1 text-[15px] font-semibold leading-snug text-gray-900">
        {doc.title}
      </h3>
      <p className="text-xs text-gray-400">By {doc.author}</p>

      <div className="mt-auto border-t border-gray-100 pt-3 text-xs text-gray-400">
        Updated {doc.updated}
      </div>
    </div>
  );
}