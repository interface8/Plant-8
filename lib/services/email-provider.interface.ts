/**
 * Email Provider Interface
 * 
 * Abstract interface that all email providers must implement.
 * This allows for easy switching between different email services
 * and enables failover/load balancing strategies.
 */

export interface EmailMessage {
  to: string | string[];
  from: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: string;
}

export interface IEmailProvider {
  /**
   * Name of the email provider (e.g., "Resend", "SendGrid", "Nodemailer")
   */
  name: string;

  /**
   * Send an email using this provider
   */
  send(message: EmailMessage): Promise<EmailSendResult>;

  /**
   * Check if the provider is properly configured and ready to use
   */
  isConfigured(): boolean;

  /**
   * Get the current rate limit status (optional)
   */
  getRateLimitStatus?(): Promise<{
    remaining: number;
    limit: number;
    resetAt: Date;
  }>;
}
