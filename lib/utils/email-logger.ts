import prisma from "@/db/prisma";
import { EmailType, EmailStatus } from "@prisma/client";

interface LogEmailParams {
  userId?: string;
  recipientEmail: string;
  emailType: EmailType;
  subject: string;
  metadata?: Record<string, any>;
}

/**
 * Log an email send attempt
 */
export async function logEmail(params: LogEmailParams): Promise<string> {
  const emailLog = await prisma.emailLog.create({
    data: {
      userId: params.userId,
      recipientEmail: params.recipientEmail,
      emailType: params.emailType,
      subject: params.subject,
      status: EmailStatus.PENDING,
      metadata: params.metadata || {},
    },
  });
  
  return emailLog.id;
}

/**
 * Mark email as successfully sent
 */
export async function markEmailSent(emailLogId: string): Promise<void> {
  await prisma.emailLog.update({
    where: { id: emailLogId },
    data: {
      status: EmailStatus.SENT,
      sentAt: new Date(),
    },
  });
}

/**
 * Mark email as failed
 */
export async function markEmailFailed(
  emailLogId: string,
  failureReason: string
): Promise<void> {
  await prisma.emailLog.update({
    where: { id: emailLogId },
    data: {
      status: EmailStatus.FAILED,
      failureReason,
    },
  });
}

/**
 * Get user's email history
 */
export async function getUserEmailHistory(userId: string, limit = 50) {
  return prisma.emailLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Get email statistics
 */
export async function getEmailStats(userId?: string) {
  const where = userId ? { userId } : {};
  
  const [total, sent, failed, pending] = await Promise.all([
    prisma.emailLog.count({ where }),
    prisma.emailLog.count({ where: { ...where, status: EmailStatus.SENT } }),
    prisma.emailLog.count({ where: { ...where, status: EmailStatus.FAILED } }),
    prisma.emailLog.count({ where: { ...where, status: EmailStatus.PENDING } }),
  ]);
  
  return { total, sent, failed, pending };
}
