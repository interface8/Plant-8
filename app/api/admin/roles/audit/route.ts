import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.roles?.includes("ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    // Get role assignment history
    const roleAssignments = await prisma.userRole.findMany({
      take: limit,
      skip: offset,
      orderBy: { assignedAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Get role creation history
    const roleHistory = await prisma.role.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        modifiedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    // Get recent activity summary
    const recentActivity = [
      ...roleAssignments.map((assignment) => ({
        id: `assignment-${assignment.userId}-${assignment.roleId}`,
        type: "role_assigned",
        description: `Role "${assignment.role.name}" assigned to ${assignment.user.name}`,
        user: assignment.user,
        role: assignment.role,
        performedBy: assignment.assignedByUser,
        timestamp: assignment.assignedAt,
      })),
      ...roleHistory
        .filter((role) => role.createdAt)
        .map((role) => ({
          id: `role-created-${role.id}`,
          type: "role_created",
          description: `Role "${role.name}" created`,
          role,
          performedBy: role.createdByUser,
          timestamp: role.createdAt,
        })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    return NextResponse.json({
      roleAssignments,
      roleHistory,
      recentActivity,
      totalAssignments: roleAssignments.length,
    });
  } catch (error) {
    console.error("Error fetching role audit:", error);
    return NextResponse.json(
      { error: "Failed to fetch role audit data" },
      { status: 500 }
    );
  }
}