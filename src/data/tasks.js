export const columns = ["To Do", "In Progress", "Review", "Done"];

export const PRIORITY_STYLES = {
  High: "bg-red-50 text-red-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-gray-100 text-gray-500",
};

export const initialTasks = [];

export function getProjectName(projects, projectId) {
  return projects.find((p) => p.id === projectId)?.name ?? "Unknown project";
}