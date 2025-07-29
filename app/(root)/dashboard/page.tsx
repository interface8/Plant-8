import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Head from "next/head";
import prisma from "@/db/prisma";
import ActiveProjects from "@/components/dashboard/activeProjects";
import FinancialCharts from "@/components/dashboard/financialCharts";
import InvestmentSummary from "@/components/dashboard/InvestmentSummary";
import ProgressFeed from "@/components/dashboard/progressFeed";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const investments = await prisma.investment.findMany({
    where: { userId: session.user.id },
    include: {
      product: { select: { id: true, name: true, imageUrl: true } },
      productType: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const activeProjectsCount = investments.filter(
    (inv) => inv.status === "PENDING" || inv.status === "ACTIVE"
  ).length;
  const monthlyReturns =
    investments.reduce((sum, inv) => sum + (inv.expectedReturn || 0), 0) * 0.1; //  10% monthly
  const portfolioGrowth =
    totalInvestment > 0
      ? ((totalInvestment + monthlyReturns) / totalInvestment - 1) * 100
      : 0;

  return (
    <>
      <Head>
        <title>Your Investment Dashboard - Agribid</title>
        <meta
          name="description"
          content="View your investment portfolio, active projects, and recent updates."
        />
        <meta
          name="keywords"
          content="investment dashboard, agricultural investments, Agribid"
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta
          property="og:title"
          content="Your Investment Dashboard - Agribid"
        />
        <meta
          property="og:description"
          content="View your investment portfolio, active projects, and recent updates."
        />
        <meta property="og:type" content="website" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Your Dashboard
            </h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <InvestmentSummary
              stats={{
                totalInvestment,
                activeProjectsCount,
                monthlyReturns,
                portfolioGrowth,
              }}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              <FinancialCharts />
              <ActiveProjects investments={investments} />
            </div>
            <div className="lg:col-span-1">
              <ProgressFeed investments={investments} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// import ActiveProjects from "@/components/dashboard/activeProjects";
// import FinancialCharts from "@/components/dashboard/financialCharts";
// import InvestmentSummary from "@/components/dashboard/InvestmentSummary";
// import ProgressFeed from "@/components/dashboard/progressFeed";

// // export default async function Dashboard() {
// //   return (
// //     <div className="min-h-screen bg-gray-50 py-8">
// //       <div className="container mx-auto px-4">
// //         <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
// //         <InvestmentSummary />
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 mb-5">
// //           <ActiveProjects />
// //           <ProgressFeed />
// //         </div>
// //         <FinancialCharts />
// //       </div>
// //     </div>
// //   );
// // }

// export default function Dashboard() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//             Your Dashboard
//           </h1>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
//         <div className="mb-6 md:mb-8">
//           <InvestmentSummary />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
//           <div className="lg:col-span-2 space-y-6 md:space-y-8">
//             <FinancialCharts />
//             <ActiveProjects />
//           </div>

//           <div className="lg:col-span-1">
//             <ProgressFeed />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
