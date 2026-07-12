export const PRIORITY_STYLES = {
  Urgent: "bg-red-50 text-red-600",
  Important: "bg-amber-50 text-amber-600",
  General: "bg-blue-50 text-blue-600",
};

export const announcements = [
  {
    id: "ann-1",
    title: "Office closed for Dashain holidays",
    body: "The office will be closed from Oct 18–22 for Dashain. All deadlines falling in this window are pushed back by one week automatically.",
    author: "Alex Rivera",
    department: "Operations",
    priority: "Important",
    pinned: true,
    postedAt: "2 days ago",
  },
  {
    id: "ann-2",
    title: "New design system v2 is live",
    body: "The updated component library is now available in Figma and the shared repo. Please migrate any new work to the v2 tokens starting this sprint.",
    author: "Priya Sharma",
    department: "Product Design",
    priority: "General",
    pinned: false,
    postedAt: "4 days ago",
  },
  {
    id: "ann-3",
    title: "Server maintenance tonight 11PM–1AM",
    body: "The staging environment will be unavailable during this window for a database migration. Production is unaffected.",
    author: "David Miller",
    department: "Backend Engineering",
    priority: "Urgent",
    pinned: true,
    postedAt: "6 hours ago",
  },
  {
    id: "ann-4",
    title: "Q4 all-hands scheduled for Nov 3",
    body: "Calendar invites went out this morning. Please RSVP by end of week so we can finalize the agenda.",
    author: "Alex Rivera",
    department: "Operations",
    priority: "General",
    pinned: false,
    postedAt: "1 week ago",
  },
];