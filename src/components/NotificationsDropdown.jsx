import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNotifications } from "../context/NotificationsContext";

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative"
        aria-label="Notifications"
      >
        <Bell className="cursor-pointer text-gray-600 hover:text-blue-600" />
        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-20 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <p className="text-sm font-semibold text-gray-900">Notifications</p>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                >
                  <CheckCheck size={13} />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-gray-400">
                  No notifications yet.
                </p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`flex w-full items-start gap-2.5 border-b border-gray-50 px-4 py-3 text-left hover:bg-gray-50 ${
                      !n.read ? "bg-blue-50/40" : ""
                    }`}
                  >
                    {!n.read && (
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    )}
                    <div className={n.read ? "pl-3.5" : ""}>
                      <p className="text-sm text-gray-700">{n.message}</p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {timeAgo(n.created_at)}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}