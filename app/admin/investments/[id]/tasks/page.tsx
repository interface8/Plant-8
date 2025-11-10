import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { notFound } from "next/navigation";
import AdminTaskManagement from "@/components/admin/investments/admin-task-management";

interface AdminInvestmentTasksPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminInvestmentTasksPage({ params }: AdminInvestmentTasksPageProps) {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/unauthorized");
  }

  const { id } = await params;

  const investment = await prisma.investment.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
          description: true,
          images: { select: { url: true } },
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
              id: true,
              name: true,
              state: { select: { id: true, name: true } },
            },
          },
        },
      },
      tasks: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          imageUrl: true,
          completedAt: true,
          createdAt: true,
          updatedAt: true,
          modifiedOn: true,
          inspectorId: true,
          inspector: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          modifiedBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!investment) {
    notFound();
  }

  // Calculate task statistics
  const totalTasks = investment.tasks.length;
  const completedTasks = investment.tasks.filter(t => t.status === 'COMPLETED').length;
  const inProgressTasks = investment.tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const pendingTasks = investment.tasks.filter(t => t.status === 'PENDING').length;
  const overdueTasks = investment.tasks.filter(t => t.status === 'OVERDUE').length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const investmentData = {
    ...investment,
    createdAt: investment.createdAt.toISOString(),
    modifiedAt: investment.modifiedAt?.toISOString() || null,
    product: {
      ...investment.product,
      images: Array.isArray(investment.product.images) 
        ? investment.product.images.map((img: { url: string }) => img.url) 
        : [],
    },
    tasks: investment.tasks.map(task => ({
      ...task,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      completedAt: task.completedAt?.toISOString() || null,
      modifiedOn: task.modifiedOn?.toISOString() || null,
    })),
    taskStats: {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      pending: pendingTasks,
      overdue: overdueTasks,
      progressPercentage,
    },
  };

  return <AdminTaskManagement investment={investmentData} adminId={session.user.id!} />;
}
