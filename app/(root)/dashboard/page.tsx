import ActiveProjects from "@/components/dashboard/activeProjects";
import FinancialCharts from "@/components/dashboard/financialCharts";
import InvestmentSummary from "@/components/dashboard/InvestmentSummary";
import ProgressFeed from "@/components/dashboard/progressFeed";

// export default async function Dashboard() {
//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4">
//         <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
//         <InvestmentSummary />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 mb-5">
//           <ActiveProjects />
//           <ProgressFeed />
//         </div>
//         <FinancialCharts />
//       </div>
//     </div>
//   );
// }

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Your Dashboard
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <InvestmentSummary />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <FinancialCharts />
            <ActiveProjects />
          </div>

          <div className="lg:col-span-1">
            <ProgressFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
