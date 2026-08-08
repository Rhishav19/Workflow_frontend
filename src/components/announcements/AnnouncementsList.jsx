import AnnouncementCard from "./AnnouncementCard";

export default function AnnouncementsList({ announcements, onTogglePin }) {
  if (announcements.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60 px-6 py-16 text-center">
        <p className="text-[15px] font-medium text-gray-600">
          No announcements yet.
        </p>
      </div>
    );
  }

  // Pinned first, then by however they're ordered otherwise.
  const sorted = [...announcements].sort(
    (a, b) => Number(b.pinned) - Number(a.pinned)
  );

  return (
    <div className="flex flex-col gap-4">
      {sorted.map((announcement) => (
        <AnnouncementCard
          key={announcement.id}
          announcement={announcement}
          onTogglePin={onTogglePin}
        />
      ))}
    </div>
  );
}