import ProjectCard from "./ProjectCard";

export default function ProjectsGrid({ projects }) {
  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60 px-6 py-16 text-center">
        <p className="text-[15px] font-medium text-gray-600">
          No projects match your search.
        </p>
        <p className="mt-1 text-sm text-gray-400">
          Try a different keyword or filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}