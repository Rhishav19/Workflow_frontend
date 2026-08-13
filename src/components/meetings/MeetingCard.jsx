import { useState } from "react";
import { Clock3, MapPin, Trash2, Users } from "lucide-react";

const STATUS_STYLES = {
  Scheduled: "bg-blue-50 text-blue-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-gray-100 text-gray-500",
};

export default function MeetingCard({ meeting, projectName, canManage, onUpdateStatus, onSaveMinutes, onDelete }) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(meeting.notes ?? "");

  const dateLabel = new Date(meeting.scheduledAt).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  function handleSaveNotes() {
    onSaveMinutes(meeting.id, notesDraft.trim());
    setEditingNotes(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{meeting.title}</p>
          {projectName && <p className="text-xs text-gray-400">{projectName}</p>}
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[meeting.status]}`}
        >
          {meeting.status}
        </span>
      </div>

      {meeting.description && (
        <p className="mb-3 text-sm text-gray-500">{meeting.description}</p>
      )}

      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Clock3 size={13} />
          {dateLabel} · {meeting.durationMinutes}m
        </span>
        {meeting.location && (
          <span className="flex items-center gap-1">
            <MapPin size={13} />
            {meeting.location}
          </span>
        )}
        {meeting.attendees.length > 0 && (
          <span className="flex items-center gap-1">
            <Users size={13} />
            {meeting.attendees.length} attendee{meeting.attendees.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {editingNotes ? (
        <div className="mb-3">
          <textarea
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            rows={4}
            placeholder="What was discussed, decided, and who owns what next..."
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={() => setEditingNotes(false)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNotes}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
            >
              Save Minutes
            </button>
          </div>
        </div>
      ) : meeting.notes ? (
        <div className="mb-3 rounded-lg bg-gray-50 p-3">
          <p className="mb-1 text-xs font-medium text-gray-500">Minutes</p>
          <p className="whitespace-pre-wrap text-sm text-gray-700">{meeting.notes}</p>
          {canManage && (
            <button
              onClick={() => setEditingNotes(true)}
              className="mt-2 text-xs font-medium text-blue-600 hover:underline"
            >
              Edit
            </button>
          )}
        </div>
      ) : null}

      {canManage && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex gap-2">
            {meeting.status === "Scheduled" && (
              <>
                {!meeting.notes && (
                  <button
                    onClick={() => setEditingNotes(true)}
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Add Minutes
                  </button>
                )}
                <button
                  onClick={() => onUpdateStatus(meeting.id, "Cancelled")}
                  className="text-xs font-medium text-gray-500 hover:underline"
                >
                  Cancel Meeting
                </button>
              </>
            )}
          </div>
          <button
            onClick={() => onDelete(meeting.id)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
