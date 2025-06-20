import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(
      `user-profiles/${session.user.id}/${file.name}`,
      file,
      {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
      }
    );

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image: blob.url,
        modifiedById: session.user.id,
        modifiedOn: new Date(),
      },
      include: {
        roles: { include: { role: true } },
        addresses: { include: { addressType: true } },
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      roles: user.roles.map((r) => r.role.name),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      modifiedById: user.modifiedById,
      modifiedOn: user.modifiedOn?.toISOString(),
      addresses: user.addresses.map((addr) => ({
        ...addr,
        modifiedOn: addr.modifiedOn?.toISOString(),
      })),
    });
  } catch (error) {
    console.error("POST profile image error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
