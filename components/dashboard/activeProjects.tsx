export default function ActiveProjects() {
    // Mock data
    const projects = [
      { id: 1, title: 'Organic Avocado Farm', progress: 65, status: 'Active' },
      { id: 2, title: 'Free-Range Poultry', progress: 40, status: 'Active' },
      { id: 3, title: 'Sustainable Cocoa', progress: 20, status: 'Initiating' },
    ];
  
    return (
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Active Projects</h2>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="border-b pb-4 last:border-b-0">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="text-gray-600">Progress: {project.progress}%</p>
              <p className="text-gray-600">Status: {project.status}</p>
              <a
                href={`/projects/${project.id}`}
                className="text-green-500 hover:underline"
              >
                View Details
              </a>
            </div>
          ))}
        </div>
      </section>
    );
  }