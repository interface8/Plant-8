/**
 * SendGrid Email Provider
 * 
 * Implementation using SendGrid API.
 * Free tier: 100 emails/day
 * Paid tiers: Starting at $19.95/month for 50k emails
 */

import sgMail from "@sendgrid/mail";
import {
  IEmailProvider,
  EmailMessage,
  EmailSendResult,
} from "../email-provider.interface";

export class SendGridProvider implements IEmailProvider {
  name = "SendGrid";
  private apiKey: string;
  private isSetup = false;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.SENDGRID_API_KEY || "";

    if (this.isConfigured()) {
      sgMail.setApiKey(this.apiKey);
      this.isSetup = true;
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey.startsWith("SG.");
  }

  async send(message: EmailMessage): Promise<EmailSendResult> {
    if (!this.isSetup) {
      return {
        success: false,
        error: "SendGrid provider not configured",
        provider: this.name,
      };
    }

    try {
      const [response] = await sgMail.send({
        from: message.from,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
        replyTo: message.replyTo,
        cc: message.cc,
        bcc: message.bcc,
        attachments: message.attachments?.map((att) => ({
          filename: att.filename,
          content: att.content.toString("base64"),
          type: att.contentType || "application/octet-stream",
          disposition: "attachment",
        })),
      });

      return {
        success: true,
        messageId: response.headers["x-message-id"] as string,
        provider: this.name,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "Unknown error",
        provider: this.name,
      };
    }
  }
}
