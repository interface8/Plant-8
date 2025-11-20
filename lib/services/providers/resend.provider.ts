/**
 * Resend Email Provider
 * 
 * Implementation of the email provider interface using Resend.
 * Supports the free tier (100 emails/day) and paid tiers.
 */

import { Resend } from "resend";
import {
  IEmailProvider,
  EmailMessage,
  EmailSendResult,
} from "../email-provider.interface";

export class ResendProvider implements IEmailProvider {
  name = "Resend";
  private client: Resend | null = null;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.RESEND_API_KEY || "";
    
    if (this.isConfigured()) {
      this.client = new Resend(this.apiKey);
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey.startsWith("re_");
  }

  async send(message: EmailMessage): Promise<EmailSendResult> {
    if (!this.client) {
      return {
        success: false,
        error: "Resend provider not configured",
        provider: this.name,
      };
    }

    try {
      const result = await this.client.emails.send({
        from: message.from,
        to: Array.isArray(message.to) ? message.to : [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
        replyTo: message.replyTo,
        cc: message.cc,
        bcc: message.bcc,
        attachments: message.attachments,
      });

      if (result.error) {
        return {
          success: false,
          error: result.error.message,
          provider: this.name,
        };
      }

      return {
        success: true,
        messageId: result.data?.id,
        provider: this.name,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        provider: this.name,
      };
    }
  }
}
