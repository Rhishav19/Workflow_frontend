import { Upload } from "lucide-react";

export default function DocsHeader({ onUploadClick }) {
  return (
    <div className="mb-7 flex items-start justify-between">
      <div>
        <h1 className="text-[32px] font-bold text-gray-900">Docs</h1>
        <p className="mt-1 text-[15px] text-gray-500">
          Shared documents and resources across the team.
        </p>
      </div>
      <button
        onClick={onUploadClick}
        className="flex h-11 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-[15px] font-medium text-white hover:bg-blue-700"
      >
        <Upload size={17} />
        Upload Doc
      </button>
    </div>
  );
}