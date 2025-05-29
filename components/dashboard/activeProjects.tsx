export default function ActiveProjects() {
  const projects = [
    { id: 1, title: "Organic Avocado Farm", progress: 65, status: "Active" },
    { id: 2, title: "Free-Range Poultry", progress: 40, status: "Active" },
    { id: 3, title: "Sustainable Cocoa", progress: 20, status: "Initiating" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Initiating":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">
        Active Projects
      </h2>
      <div className="space-y-3 md:space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm md:text-base">
                  {project.title}
                </h3>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs md:text-sm text-gray-600 mb-1">
                    <span>Progress: {project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
                <button className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs md:text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
