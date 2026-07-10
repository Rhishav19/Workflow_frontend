const projects = [
  {
    id: 1,
    name: "Workflow Dashboard",
    progress: 75,
    status: "On Track",
  },
  {
    id: 2,
    name: "Mobile App",
    progress: 45,
    status: "In Progress",
  },
  {
    id: 3,
    name: "Marketing Website",
    progress: 90,
    status: "Almost Done",
  },
];

const ActiveProjects = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">
        Active Projects
      </h2>

      <div className="space-y-5">
        {projects.map((project) => (
          <div key={project.id}>
            <div className="flex justify-between mb-2">
              <span className="font-medium">
                {project.name}
              </span>

              <span className="text-sm text-gray-500">
                {project.progress}%
              </span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full">
              <div
                className="h-3 bg-blue-600 rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>

            <p className="text-xs text-green-600 mt-2">
              {project.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveProjects;