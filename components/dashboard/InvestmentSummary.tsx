interface InvestmentSummaryProps {
  stats: {
    totalInvestment: number;
    activeProjectsCount: number;
    monthlyReturns: number;
    portfolioGrowth: number;
  };
}

export default function InvestmentSummary({ stats }: InvestmentSummaryProps) {
  const formattedStats = [
    {
      label: "Total Investment",
      value: `₦${stats.totalInvestment.toFixed(2)}`,
      change:
        stats.totalInvestment > 0
          ? `+${(stats.totalInvestment * 0.12).toFixed(2)}`
          : "+0.00",
    },
    {
      label: "Active Projects",
      value: stats.activeProjectsCount.toString(),
      change: `+${Math.min(stats.activeProjectsCount, 2)}`,
    },
    {
      label: "Monthly Returns",
      value: `₦${stats.monthlyReturns.toFixed(2)}`,
      change: "+8%",
    },
    {
      label: "Portfolio Growth",
      value: `${stats.portfolioGrowth.toFixed(1)}%`,
      change:
        stats.portfolioGrowth > 0
          ? `+${(stats.portfolioGrowth * 0.1).toFixed(1)}%`
          : "+0.0%",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">
        Investment Overview
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {formattedStats.map((stat, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm text-gray-600 mb-1">
              {stat.label}
            </p>
            <p className="text-lg md:text-xl font-bold text-gray-900">
              {stat.value}
            </p>
            <p className="text-xs md:text-sm text-green-600 font-medium">
              {stat.change}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// export default function InvestmentSummary() {
//   const stats = [
//     { label: "Total Investment", value: "$125,000", change: "+12%" },
//     { label: "Active Projects", value: "8", change: "+2" },
//     { label: "Monthly Returns", value: "$3,240", change: "+8%" },
//     { label: "Portfolio Growth", value: "18.5%", change: "+2.1%" },
//   ];

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
//       <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">
//         Investment Overview
//       </h2>
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-gray-50 rounded-lg p-3 md:p-4">
//             <p className="text-xs md:text-sm text-gray-600 mb-1">
//               {stat.label}
//             </p>
//             <p className="text-lg md:text-xl font-bold text-gray-900">
//               {stat.value}
//             </p>
//             <p className="text-xs md:text-sm text-green-600 font-medium">
//               {stat.change}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
