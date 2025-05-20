export default function InvestmentSummary() {
  // Mock data
  const summary = {
    totalInvested: 50000,
    activeProjects: 3,
    expectedROI: "12.5%",
    nextPayout: "2025-06-01",
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">Investment Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <p className="text-gray-600">Total Invested</p>
          <p className="text-xl font-bold">
            ${summary.totalInvested.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Active Projects</p>
          <p className="text-xl font-bold">{summary.activeProjects}</p>
        </div>
        <div>
          <p className="text-gray-600">Expected ROI</p>
          <p className="text-xl font-bold">{summary.expectedROI}</p>
        </div>
        <div>
          <p className="text-gray-600">Next Payout</p>
          <p className="text-xl font-bold">{summary.nextPayout}</p>
        </div>
      </div>
    </section>
  );
}
