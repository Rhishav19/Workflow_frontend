import { useState } from "react";
import AnnouncementsHeader from "../components/announcements/AnnouncementsHeader";
import AnnouncementsList from "../components/announcements/AnnouncementsList";
import NewAnnouncementModal from "../components/announcements/NewAnnouncementModal";
import { useAnnouncements } from "../context/AnnouncementContext";
import { useWorkspace } from "../context/WorkspaceContext";
import { useAuth } from "../context/AuthContext";
import { useActivity } from "../context/ActivityContext";
import { useMembers } from "../context/MembersContext";
import { useNotifications } from "../context/NotificationsContext";

export default function Announcements() {
  const { workspaceId } = useWorkspace();
  const { user } = useAuth();
  const { announcements, addAnnouncement, togglePin, deleteAnnouncement } = useAnnouncements();
  const { logActivity } = useActivity();
  const { members } = useMembers();
  const { notifyMany } = useNotifications();
  const [modalOpen, setModalOpen] = useState(false);

  const workspaceAnnouncements = announcements.filter(
    (a) => a.workspaceId === workspaceId
  );

  async function handleCreate(newAnnouncement) {
    const actor = user?.name ?? "Unknown";
    const { error } = await addAnnouncement({
      ...newAnnouncement,
      workspaceId,
      author: actor,
    });

    if (!error) {
      logActivity({
        workspaceId,
        actor,
        verb: "posted an announcement",
        target: newAnnouncement.title,
      });

      const recipientEmails = members
        .filter((m) => m.workspaceId === workspaceId)
        .map((m) => m.email)
        .filter((email) => email && email !== user?.email);

      if (recipientEmails.length > 0) {
        notifyMany(recipientEmails, {
          workspaceId,
          actor,
          title: `${actor} posted an announcement`,
          body: newAnnouncement.title,
          link: "/dashboard/announcements",
        });
      }
    }
  }

  function handleDelete(id) {
    deleteAnnouncement(id);
  }

  return (
    <div className="px-8 py-8">
      <AnnouncementsHeader onNew={() => setModalOpen(true)} />
      <AnnouncementsList
        announcements={workspaceAnnouncements}
        onTogglePin={togglePin}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <NewAnnouncementModal onClose={() => setModalOpen(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}