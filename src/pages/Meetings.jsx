import { useState } from "react";
import { Plus } from "lucide-react";
import { useMeetings } from "../context/MeetingsContext";
import { useProjects } from "../context/ProjectsContext";
import { useMembers } from "../context/MembersContext";
import { useAuth } from "../context/AuthContext";
import { useWorkspace } from "../context/WorkspaceContext";
import NewMeetingModal from "../components/meetings/NewMeetingModal";
import MeetingCard from "../components/meetings/MeetingCard";

export default function Meetings() {
  const { meetings, loading, scheduleMeeting, updateMeetingStatus, saveMinutes, deleteMeeting } =
    useMeetings();
  const { projects } = useProjects();
  const { members } = useMembers();
  const { user } = useAuth();
  const { workspaceId, currentRole } = useWorkspace();
  const [showModal, setShowModal] = useState(false);

  const canManage = currentRole === "Admin" || currentRole === "Manager";

  const scoped = meetings.filter((m) => m.workspaceId === workspaceId);
  const upcoming = scoped.filter((m) => m.status === "Scheduled");
  const past = scoped.filter((m) => m.status !== "Scheduled");

  function projectName(projectId) {
    return projects.find((p) => p.id === projectId)?.name;
  }

  return (
    <div className="px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Schedule meetings and keep minutes in one place.
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowModal(true)}
            className="flex h-10 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            Schedule Meeting
          </button>
        )}
      </div>

      {loading && <p className="text-sm text-gray-400">Loading…</p>}

      {!loading && (
        <>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Upcoming
          </h2>
          {upcoming.length === 0 ? (
            <p className="mb-8 text-sm text-gray-400">No upcoming meetings.</p>
          ) : (
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {upcoming.map((m) => (
                <MeetingCard
                  key={m.id}
                  meeting={m}
                  projectName={projectName(m.projectId)}
                  canManage={canManage}
                  onUpdateStatus={updateMeetingStatus}
                  onSaveMinutes={saveMinutes}
                  onDelete={deleteMeeting}
                />
              ))}
            </div>
          )}

          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Past
          </h2>
          {past.length === 0 ? (
            <p className="text-sm text-gray-400">No past meetings yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {past.map((m) => (
                <MeetingCard
                  key={m.id}
                  meeting={m}
                  projectName={projectName(m.projectId)}
                  canManage={canManage}
                  onUpdateStatus={updateMeetingStatus}
                  onSaveMinutes={saveMinutes}
                  onDelete={deleteMeeting}
                />
              ))}
            </div>
          )}
        </>
      )}

      {showModal && (
        <NewMeetingModal
          workspaceId={workspaceId}
          organizer={user?.email}
          projects={projects}
          members={members}
          onClose={() => setShowModal(false)}
          onCreate={scheduleMeeting}
        />
      )}
    </div>
  );
}
