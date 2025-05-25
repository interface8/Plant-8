import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/lib/cookies";

export async function POST() {
  try {
    await removeAuthCookie();
    return NextResponse.json({ message: "Signed out successfully" });
  } catch (error) {
    console.error("Sign out error:", error);
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 });
  }
}
