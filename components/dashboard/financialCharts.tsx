export default function FinancialCharts() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">
        Financial Performance
      </h2>
      <div className="bg-gray-50 rounded-lg p-6 md:p-8 text-center min-h-48 md:min-h-64 flex items-center justify-center">
        <div className="text-gray-500">
          <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 bg-gray-200 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 md:w-8 md:h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p className="text-sm md:text-base">
            Financial charts will be implemented with a charting library
          </p>
        </div>
      </div>
    </div>
  );
}
