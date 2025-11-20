/**
 * Nodemailer Email Provider
 * 
 * Implementation using Nodemailer with SMTP.
 * Can be used with Gmail, Outlook, or any SMTP server.
 * Great as a backup provider with unlimited sending (if using your own SMTP server).
 */

import nodemailer from "nodemailer";
import {
  IEmailProvider,
  EmailMessage,
  EmailSendResult,
} from "../email-provider.interface";

export class NodemailerProvider implements IEmailProvider {
  name = "Nodemailer";
  private transporter: nodemailer.Transporter | null = null;

  constructor(config?: {
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user: string;
      pass: string;
    };
  }) {
    const smtpConfig = config || {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
    };

    if (this.isConfigured(smtpConfig)) {
      this.transporter = nodemailer.createTransport(smtpConfig);
    }
  }

  isConfigured(config?: any): boolean {
    const checkConfig = config || {
      host: process.env.SMTP_HOST,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    return !!(
      checkConfig.host &&
      checkConfig.auth?.user &&
      checkConfig.auth?.pass
    );
  }

  async send(message: EmailMessage): Promise<EmailSendResult> {
    if (!this.transporter) {
      return {
        success: false,
        error: "Nodemailer provider not configured",
        provider: this.name,
      };
    }

    try {
      const result = await this.transporter.sendMail({
        from: message.from,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
        replyTo: message.replyTo,
        cc: message.cc,
        bcc: message.bcc,
        attachments: message.attachments,
      });

      return {
        success: true,
        messageId: result.messageId,
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
