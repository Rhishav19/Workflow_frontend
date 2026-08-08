import { Pin } from "lucide-react";
import { PRIORITY_STYLES } from "../../data/announcements";

export default function AnnouncementCard({ announcement, onTogglePin }) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 transition-colors ${
        announcement.pinned ? "border-blue-200 bg-blue-50/30" : "border-gray-200"
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {announcement.pinned && (
            <Pin size={14} className="fill-blue-600 text-blue-600" />
          )}
          <h3 className="text-[15px] font-semibold text-gray-900">
            {announcement.title}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
            PRIORITY_STYLES[announcement.priority]
          }`}
        >
          {announcement.priority}
        </span>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-gray-600">
        {announcement.body}
      </p>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-400">
          <span className="font-medium text-gray-500">{announcement.author}</span>
          {" · "}
          {announcement.department} · {announcement.postedAt}
        </p>
        <button
          onClick={() => onTogglePin(announcement.id)}
          className="text-xs font-medium text-blue-600 hover:underline"
        >
          {announcement.pinned ? "Unpin" : "Pin"}
        </button>
      </div>
    </div>
  );
}