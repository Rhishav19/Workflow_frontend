// Turns "2026-10-28" (native date input value) into "Oct 28" for display
// on cards, matching the existing style used throughout the app.
export function formatDueDate(isoDate) {
  if (!isoDate) return "No date set";
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}