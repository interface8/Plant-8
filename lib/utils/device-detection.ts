import { headers } from "next/headers";
import prisma from "@/db/prisma";
import { EmailService } from "@/lib/services/email-service";

/**
 * Get client IP address from request headers
 */
export async function getClientIP(): Promise<string | null> {
  const headersList = await headers();
  
  // Try various headers that might contain the client IP
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIP = headersList.get("x-real-ip");
  const cfConnectingIP = headersList.get("cf-connecting-ip"); // Cloudflare
  
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwardedFor.split(",")[0].trim();
  }
  
  if (realIP) {
    return realIP.trim();
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }
  
  return null;
}

/**
 * Get user agent from request headers
 */
export async function getUserAgent(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get("user-agent");
}

/**
 * Parse device info from user agent
 */
export function parseDeviceInfo(userAgent: string | null): string {
  if (!userAgent) return "Unknown Device";
  
  const ua = userAgent.toLowerCase();
  
  // Detect OS
  let os = "Unknown OS";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac")) os = "MacOS";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad")) os = "iOS";
  
  // Detect Browser
  let browser = "Unknown Browser";
  if (ua.includes("chrome") && !ua.includes("edge")) browser = "Chrome";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("edge")) browser = "Edge";
  else if (ua.includes("opera")) browser = "Opera";
  
  return `${browser} on ${os}`;
}

/**
 * Check if device is trusted and send alert if unfamiliar
 */
export async function checkDeviceAndNotify(
  userId: string,
  userEmail: string,
  userName: string
): Promise<void> {
  try {
    const ipAddress = await getClientIP();
    const userAgent = await getUserAgent();
    const deviceInfo = parseDeviceInfo(userAgent);
    
    if (!ipAddress) {
      console.warn("Could not determine client IP address");
      return;
    }
    
    // Check if device exists and is trusted
    const existingDevice = await prisma.userDevice.findUnique({
      where: {
        userId_ipAddress: {
          userId,
          ipAddress,
        },
      },
    });
    
    const now = new Date();
    
    if (existingDevice) {
      // Update last used time
      await prisma.userDevice.update({
        where: { id: existingDevice.id },
        data: {
          lastUsedAt: now,
          userAgent,
          deviceInfo,
        },
      });
      
      // If device is not trusted yet, it's still unfamiliar - send alert
      if (!existingDevice.isTrusted) {
        await EmailService.sendUnfamiliarDeviceAlert(
          userEmail,
          userName,
          ipAddress,
          deviceInfo,
          now
        );
      }
    } else {
      // New device - create record and send alert
      await prisma.userDevice.create({
        data: {
          userId,
          ipAddress,
          userAgent,
          deviceInfo,
          isTrusted: false,
          lastUsedAt: now,
          firstSeenAt: now,
        },
      });
      
      // Send unfamiliar device alert
      await EmailService.sendUnfamiliarDeviceAlert(
        userEmail,
        userName,
        ipAddress,
        deviceInfo,
        now
      );
    }
  } catch (error) {
    console.error("Error in device check:", error);
    // Don't throw - we don't want device tracking to break sign-in
  }
}

/**
 * Mark a device as trusted
 */
export async function trustDevice(userId: string, ipAddress: string): Promise<boolean> {
  try {
    await prisma.userDevice.update({
      where: {
        userId_ipAddress: {
          userId,
          ipAddress,
        },
      },
      data: {
        isTrusted: true,
      },
    });
    return true;
  } catch (error) {
    console.error("Error trusting device:", error);
    return false;
  }
}

/**
 * Get all user devices
 */
export async function getUserDevices(userId: string) {
  return prisma.userDevice.findMany({
    where: { userId },
    orderBy: { lastUsedAt: "desc" },
  });
}

/**
 * Remove a device
 */
export async function removeDevice(userId: string, deviceId: string): Promise<boolean> {
  try {
    await prisma.userDevice.delete({
      where: {
        id: deviceId,
        userId, // Ensure user owns this device
      },
    });
    return true;
  } catch (error) {
    console.error("Error removing device:", error);
    return false;
  }
}
