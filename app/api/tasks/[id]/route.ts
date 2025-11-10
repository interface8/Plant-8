import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: Request, context: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status, imageUrl, inspectorId, comment } = body;

    // Verify task exists
    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: {
        investment: {
          select: {
            userId: true,
            id: true,
          },
        },
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Only admin or the task inspector can update
    const isAdmin = session.user.roles?.includes("ADMIN");
    if (!isAdmin && existingTask.inspectorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        status,
        imageUrl: imageUrl || existingTask.imageUrl,
        inspectorId: inspectorId || existingTask.inspectorId,
        modifiedById: session.user.id,
        modifiedOn: new Date(),
        completedAt: status === "COMPLETED" ? new Date() : existingTask.completedAt,
      },
      include: {
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
    });

    // Update investment progress
    const allTasks = await prisma.task.findMany({
      where: { investmentId: existingTask.investmentId },
    });

    const completedCount = allTasks.filter((t) => t.status === "COMPLETED").length;
    const progressPercentage = allTasks.length > 0 
      ? Math.round((completedCount / allTasks.length) * 100) 
      : 0;

    await prisma.investment.update({
      where: { id: existingTask.investmentId },
      data: {
        progress: progressPercentage,
        modifiedBy: session.user.id,
        modifiedAt: new Date(),
      },
    });

    // Create notification for the investor
    const statusText = status === "COMPLETED" ? "completed" : 
                      status === "IN_PROGRESS" ? "is in progress" :
                      status === "OVERDUE" ? "is overdue" : "updated";
    
    await prisma.notification.create({
      data: {
        userId: existingTask.investment.userId,
        type: "TASK_UPDATE",
        title: "Task Status Updated",
        message: `Task "${updatedTask.name}" ${statusText}`,
        link: `/dashboard/investments/${existingTask.investmentId}`,
        metadata: {
          taskId: updatedTask.id,
          investmentId: existingTask.investmentId,
          oldStatus: existingTask.status,
          newStatus: status,
          updatedBy: session.user.name || "Admin",
        },
      },
    });

    return NextResponse.json({
      message: "Task updated successfully",
      task: updatedTask,
      progress: progressPercentage,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request, context: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        investment: {
          select: {
            id: true,
            userId: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
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
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Check authorization
    const isAdmin = session.user.roles?.includes("ADMIN");
    const isOwner = task.investment.userId === session.user.id;
    const isInspector = task.inspectorId === session.user.id;

    if (!isAdmin && !isOwner && !isInspector) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}
