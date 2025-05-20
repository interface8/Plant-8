import ActiveProjects from "@/components/dashboard/activeProjects";
import FinancialCharts from "@/components/dashboard/financialCharts";
import InvestmentSummary from "@/components/dashboard/InvestmentSummary";
import ProgressFeed from "@/components/dashboard/progressFeed";
// import { getServerSession } from "next-auth";

// import { redirect } from "next/navigation";

export default async function Dashboard() {
  //   const session = await getServerSession();
  //   if (!session) {
  //     redirect("/api/auth/signin");
  //   }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
        <InvestmentSummary />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActiveProjects />
          <ProgressFeed />
        </div>
        <FinancialCharts />
      </div>
    </div>
  );
}
