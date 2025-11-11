import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import InvestmentEditForm from "@/components/admin/investments/investment-edit-form";

interface EditInvestmentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInvestmentPage({ params }: EditInvestmentPageProps) {
  const session = await auth();
  
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/admin");
  }

  const { id } = await params;

  // Fetch the investment data
  const investment = await prisma.investment.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
        },
      },
      productType: {
        select: {
          id: true,
          name: true,
        },
      },
      land: {
        select: {
          id: true,
          name: true,
          location: {
            select: {
              name: true,
              state: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });

  if (!investment) {
    redirect("/admin/investments");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Investment</h1>
          <p className="mt-2 text-gray-600">
            Update investment details for {investment.user.name} - {investment.product.name}
          </p>
        </div>

        <InvestmentEditForm investment={investment} />
      </div>
    </div>
  );
}