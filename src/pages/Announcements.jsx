import { useState } from "react";
import AnnouncementsHeader from "../components/announcements/AnnouncementsHeader";
import AnnouncementsList from "../components/announcements/AnnouncementsList";
import NewAnnouncementModal from "../components/announcements/NewAnnouncementModal";
import { announcements as initialAnnouncements } from "../data/announcements";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [modalOpen, setModalOpen] = useState(false);

  function handleCreate(newAnnouncement) {
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
  }

  function togglePin(id) {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a))
    );
  }

  return (
    <div className="px-8 py-8">
      <AnnouncementsHeader onNew={() => setModalOpen(true)} />
      <AnnouncementsList announcements={announcements} onTogglePin={togglePin} />

      {modalOpen && (
        <NewAnnouncementModal
          onClose={() => setModalOpen(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}