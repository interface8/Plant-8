export default function ProgressFeed() {
  // Mock data
  const updates = [
    {
      id: 1,
      project: "Organic Avocado Farm",
      update: "Planted 500 new avocado trees.",
      date: "2025-05-01",
    },
    {
      id: 2,
      project: "Free-Range Poultry",
      update: "New coop construction completed.",
      date: "2025-04-28",
    },
  ];

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Recent Updates</h2>
      <div className="space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="border-b pb-4 last:border-b-0">
            <h3 className="text-lg font-semibold">{update.project}</h3>
            <p className="text-gray-600">{update.update}</p>
            <p className="text-sm text-gray-500">{update.date}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
