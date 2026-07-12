import { Plus } from "lucide-react";

export default function AnnouncementsHeader({ onNew }) {
  return (
    <div className="mb-7 flex items-start justify-between">
      <div>
        <h1 className="text-[32px] font-bold text-gray-900">Announcements</h1>
        <p className="mt-1 text-[15px] text-gray-500">
          Company-wide updates, pinned to the top when it matters.
        </p>
      </div>
      <button
        onClick={onNew}
        className="flex h-11 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-[15px] font-medium text-white hover:bg-blue-700"
      >
        <Plus size={17} />
        New Announcement
      </button>
    </div>
  );
}