import {
  EmailProviderManager,
  ProviderStrategy,
} from "./email-provider-manager";
import {
  ResendProvider,
  NodemailerProvider,
  SendGridProvider,
} from "./providers";
import { EmailMessage } from "./email-provider.interface";

// Initialize email provider manager with multiple providers
// You can configure the strategy and providers here
const initializeProviderManager = () => {
  const providers = [];

  // Add Resend (primary provider)
  if (process.env.RESEND_API_KEY) {
    providers.push({
      provider: new ResendProvider(),
      priority: 100, // Highest priority
      maxRetries: 2,
    });
  }

  // Add SendGrid (backup provider)
  if (process.env.SENDGRID_API_KEY) {
    providers.push({
      provider: new SendGridProvider(),
      priority: 80,
      maxRetries: 2,
    });
  }

  // Add Nodemailer/SMTP (backup provider - can be your own server)
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    providers.push({
      provider: new NodemailerProvider(),
      priority: 60,
      maxRetries: 1,
    });
  }

  // Strategy options:
  // - "failover": Try providers in priority order until one succeeds (best for reliability)
  // - "round-robin": Distribute emails evenly across providers (best for rate limits)
  // - "priority": Always use highest priority, fallback only on failure
  const strategy: ProviderStrategy =
    (process.env.EMAIL_STRATEGY as ProviderStrategy) || "failover";

  return new EmailProviderManager(providers, strategy);
};

const providerManager = initializeProviderManager();

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export class EmailService {
  private static fromEmail =
    process.env.EMAIL_FROM || "noreply@yourdomain.com";

  /**
   * Send an email using the configured provider(s)
   */
  static async sendEmail({
    to,
    subject,
    html,
    from,
  }: EmailOptions): Promise<boolean> {
    try {
      const message: EmailMessage = {
        from: from || this.fromEmail,
        to,
        subject,
        html,
      };

      const result = await providerManager.send(message);

      if (!result.success) {
        console.error("Email send error:", result.error, "Provider:", result.provider);
        return false;
      }

      console.log("Email sent successfully via", result.provider, "MessageId:", result.messageId);
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  }

  /**
   * Get provider statistics (useful for monitoring)
   */
  static getProviderStats() {
    return providerManager.getStats();
  }

  /**
   * Get list of configured providers
   */
  static getConfiguredProviders() {
    return providerManager.getConfiguredProviders();
  }

  /**
   * Send welcome email on sign up
   */
  static async sendWelcomeEmail(to: string, userName: string) {
    const html = this.getWelcomeEmailTemplate(userName);
    return this.sendEmail({
      to,
      subject: "Welcome to FAM 8 - Your Agricultural Investment Journey Begins!",
      html,
    });
  }

  /**
   * Send unfamiliar device sign-in alert
   */
  static async sendUnfamiliarDeviceAlert(
    to: string,
    userName: string,
    ipAddress: string,
    deviceInfo: string,
    timestamp: Date
  ) {
    const html = this.getUnfamiliarDeviceTemplate(
      userName,
      ipAddress,
      deviceInfo,
      timestamp
    );
    return this.sendEmail({
      to,
      subject: "🔔 New Sign-In from Unfamiliar Device - FAM 8",
      html,
    });
  }

  /**
   * Send forgot password email with reset link
   */
  static async sendForgotPasswordEmail(
    to: string,
    userName: string,
    resetLink: string
  ) {
    const html = this.getForgotPasswordTemplate(userName, resetLink);
    return this.sendEmail({
      to,
      subject: "Reset Your FAM 8 Password",
      html,
    });
  }

  /**
   * Send password reset confirmation
   */
  static async sendPasswordResetConfirmation(to: string, userName: string) {
    const html = this.getPasswordResetConfirmationTemplate(userName);
    return this.sendEmail({
      to,
      subject: "✅ Your FAM 8 Password Has Been Reset",
      html,
    });
  }

  /**
   * Send investment creation notification
   */
  static async sendInvestmentCreatedEmail(
    to: string,
    userName: string,
    investmentDetails: {
      productName: string;
      amount: number;
      duration: string;
      expectedReturn: number;
    }
  ) {
    const html = this.getInvestmentCreatedTemplate(userName, investmentDetails);
    return this.sendEmail({
      to,
      subject: "🌱 Investment Created - Pending Approval | FAM 8",
      html,
    });
  }

  /**
   * Send investment approval notification
   */
  static async sendInvestmentApprovalEmail(
    to: string,
    userName: string,
    investmentDetails: {
      productName: string;
      amount: number;
      status: "APPROVED" | "REJECTED";
      reason?: string;
    }
  ) {
    const html = this.getInvestmentApprovalTemplate(userName, investmentDetails);
    const subject =
      investmentDetails.status === "APPROVED"
        ? "🎉 Investment Approved - FAM 8"
        : "Investment Status Update - FAM 8";
    return this.sendEmail({
      to,
      subject,
      html,
    });
  }

  /**
   * Send investment completion notification
   */
  static async sendInvestmentCompletionEmail(
    to: string,
    userName: string,
    investmentDetails: {
      productName: string;
      initialAmount: number;
      finalAmount: number;
      roi: number;
    }
  ) {
    const html = this.getInvestmentCompletionTemplate(
      userName,
      investmentDetails
    );
    return this.sendEmail({
      to,
      subject: "🎊 Investment Completed - Your Returns Are Ready! | FAM 8",
      html,
    });
  }

  /**
   * Send payment receipt
   */
  static async sendPaymentReceiptEmail(
    to: string,
    userName: string,
    paymentDetails: {
      amount: number;
      transactionId: string;
      productName: string;
      date: Date;
    }
  ) {
    const html = this.getPaymentReceiptTemplate(userName, paymentDetails);
    return this.sendEmail({
      to,
      subject: "💳 Payment Receipt - FAM 8",
      html,
    });
  }

  /**
   * Send weekly investment progress report
   */
  static async sendWeeklyProgressReport(
    to: string,
    userName: string,
    investments: Array<{
      productName: string;
      amount: number;
      progress: number;
      daysRemaining: number;
      status: string;
    }>
  ) {
    const html = this.getWeeklyProgressReportTemplate(userName, investments);
    return this.sendEmail({
      to,
      subject: "📊 Your Weekly Investment Progress Report - FAM 8",
      html,
    });
  }

  // Email Templates
  private static getWelcomeEmailTemplate(userName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to FAM 8</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1E7B47 0%, #145C33 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Welcome to FAM 8! 🌱</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">Hello ${userName}!</h2>
                      
                      <p style="margin: 0 0 15px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                        We're thrilled to have you join the FAM 8 family! You've taken the first step towards building wealth through sustainable agricultural investments.
                      </p>
                      
                      <p style="margin: 0 0 15px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                        With FAM 8, you can:
                      </p>
                      
                      <ul style="margin: 0 0 25px 0; color: #666666; font-size: 16px; line-height: 1.8;">
                        <li>Invest in verified agricultural projects</li>
                        <li>Track your investment progress in real-time</li>
                        <li>Earn competitive returns on your capital</li>
                        <li>Support sustainable farming practices</li>
                      </ul>
                      
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #1E7B47 0%, #145C33 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                          Explore Investments
                        </a>
                      </div>
                      
                      <p style="margin: 25px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                        If you have any questions, our support team is here to help!
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                      <p style="margin: 0 0 10px 0; color: #999999; font-size: 14px;">
                        © 2025 FAM 8. All rights reserved.
                      </p>
                      <p style="margin: 0; color: #999999; font-size: 12px;">
                        Building wealth through sustainable agriculture
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  private static getUnfamiliarDeviceTemplate(
    userName: string,
    ipAddress: string,
    deviceInfo: string,
    timestamp: Date
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Sign-In Alert</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #ff6b6b 0%, #c92a2a 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🔔 New Sign-In Detected</h1>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 22px;">Hello ${userName},</h2>
                      
                      <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                        We detected a sign-in to your FAM 8 account from a device we don't recognize.
                      </p>
                      
                      <div style="background-color: #f8f9fa; border-left: 4px solid #1E7B47; padding: 20px; margin: 25px 0;">
                        <p style="margin: 0 0 10px 0; color: #333333; font-size: 14px;"><strong>Time:</strong> ${timestamp.toLocaleString()}</p>
                        <p style="margin: 0 0 10px 0; color: #333333; font-size: 14px;"><strong>IP Address:</strong> ${ipAddress}</p>
                        <p style="margin: 0; color: #333333; font-size: 14px;"><strong>Device:</strong> ${deviceInfo}</p>
                      </div>
                      
                      <p style="margin: 25px 0 15px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                        <strong>Was this you?</strong>
                      </p>
                      
                      <p style="margin: 0 0 25px 0; color: #666666; font-size: 15px; line-height: 1.6;">
                        If you recognize this activity, you can safely ignore this email. If you didn't sign in, please secure your account immediately by changing your password.
                      </p>
                      
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.NEXTAUTH_URL}/profile/security" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #1E7B47 0%, #145C33 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                          Secure My Account
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                      <p style="margin: 0; color: #999999; font-size: 14px;">© 2025 FAM 8. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  private static getForgotPasswordTemplate(
    userName: string,
    resetLink: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #1E7B47 0%, #145C33 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🔑 Reset Your Password</h1>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 22px;">Hello ${userName},</h2>
                      
                      <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                        We received a request to reset your FAM 8 password. Click the button below to create a new password:
                      </p>
                      
                      <div style="text-align: center; margin: 35px 0;">
                        <a href="${resetLink}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #1E7B47 0%, #145C33 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                          Reset Password
                        </a>
                      </div>
                      
                      <p style="margin: 25px 0 15px 0; color: #666666; font-size: 15px; line-height: 1.6;">
                        This link will expire in <strong>1 hour</strong> for security reasons.
                      </p>
                      
                      <p style="margin: 0 0 20px 0; color: #999999; font-size: 14px; line-height: 1.6;">
                        If you didn't request this password reset, please ignore this email or contact our support team if you have concerns.
                      </p>
                      
                      <div style="background-color: #f8f9fa; padding: 15px; margin: 25px 0; border-radius: 4px;">
                        <p style="margin: 0; color: #666666; font-size: 13px; line-height: 1.5;">
                          <strong>Tip:</strong> If the button doesn't work, copy and paste this link into your browser:<br>
                          <a href="${resetLink}" style="color: #1E7B47; word-break: break-all;">${resetLink}</a>
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                      <p style="margin: 0; color: #999999; font-size: 14px;">© 2025 FAM 8. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  private static getPasswordResetConfirmationTemplate(userName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset Successful</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #1E7B47 0%, #145C33 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">✅ Password Reset Successful</h1>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 22px;">Hello ${userName},</h2>
                      
                      <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                        Your FAM 8 password has been successfully reset. You can now sign in with your new password.
                      </p>
                      
                      <div style="text-align: center; margin: 35px 0;">
                        <a href="${process.env.NEXTAUTH_URL}/sign-in" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #1E7B47 0%, #145C33 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                          Sign In Now
                        </a>
                      </div>
                      
                      <p style="margin: 25px 0 0 0; color: #999999; font-size: 14px; line-height: 1.6;">
                        If you didn't make this change, please contact our support team immediately.
                      </p>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                      <p style="margin: 0; color: #999999; font-size: 14px;">© 2025 FAM 8. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  private static getInvestmentCreatedTemplate(
    userName: string,
    details: {
      productName: string;
      amount: number;
      duration: string;
      expectedReturn: number;
    }
  ): string {
    const formatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Investment Created</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #1E7B47 0%, #145C33 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🌱 Investment Created!</h1>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 22px;">Hello ${userName},</h2>
                      
                      <p style="margin: 0 0 25px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                        Your investment has been successfully created and is now pending approval from our team.
                      </p>
                      
                      <div style="background-color: #f0f9f4; border-left: 4px solid #1E7B47; padding: 25px; margin: 25px 0;">
                        <h3 style="margin: 0 0 15px 0; color: #1E7B47; font-size: 18px;">Investment Details</h3>
                        <p style="margin: 0 0 10px 0; color: #333333; font-size: 15px;"><strong>Product:</strong> ${details.productName}</p>
                        <p style="margin: 0 0 10px 0; color: #333333; font-size: 15px;"><strong>Amount:</strong> ${formatter.format(details.amount)}</p>
                        <p style="margin: 0 0 10px 0; color: #333333; font-size: 15px;"><strong>Duration:</strong> ${details.duration}</p>
                        <p style="margin: 0; color: #333333; font-size: 15px;"><strong>Expected Return:</strong> ${details.expectedReturn}%</p>
                      </div>
                      
                      <p style="margin: 25px 0 15px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                        <strong>What's next?</strong>
                      </p>
                      
                      <p style="margin: 0 0 25px 0; color: #666666; font-size: 15px; line-height: 1.6;">
                        Our team will review your investment and you'll receive a notification once it's approved. This usually takes 24-48 hours.
                      </p>
                      
                      <div style="text-align: center; margin: 35px 0;">
                        <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #1E7B47 0%, #145C33 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                          View Dashboard
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                      <p style="margin: 0; color: #999999; font-size: 14px;">© 2025 FAM 8. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  private static getInvestmentApprovalTemplate(
    userName: string,
    details: {
      productName: string;
      amount: number;
      status: "APPROVED" | "REJECTED";
      reason?: string;
    }
  ): string {
    const formatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    });

    const isApproved = details.status === "APPROVED";

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Investment ${isApproved ? "Approved" : "Update"}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, ${isApproved ? "#1E7B47" : "#ff6b6b"} 0%, ${isApproved ? "#145C33" : "#c92a2a"} 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                        ${isApproved ? "🎉 Investment Approved!" : "Investment Status Update"}
                      </h1>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 22px;">Hello ${userName},</h2>
                      
                      <p style="margin: 0 0 25px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                        ${
                          isApproved
                            ? "Great news! Your investment has been approved and is now active."
                            : "We regret to inform you that your investment could not be approved at this time."
                        }
                      </p>
                      
                      <div style="background-color: ${isApproved ? "#f0f9f4" : "#fff5f5"}; border-left: 4px solid ${isApproved ? "#1E7B47" : "#c92a2a"}; padding: 25px; margin: 25px 0;">
                        <h3 style="margin: 0 0 15px 0; color: ${isApproved ? "#1E7B47" : "#c92a2a"}; font-size: 18px;">Investment Details</h3>
                        <p style="margin: 0 0 10px 0; color: #333333; font-size: 15px;"><strong>Product:</strong> ${details.productName}</p>
                        <p style="margin: 0 0 10px 0; color: #333333; font-size: 15px;"><strong>Amount:</strong> ${formatter.format(details.amount)}</p>
                        <p style="margin: 0; color: #333333; font-size: 15px;"><strong>Status:</strong> ${details.status}</p>
                        ${details.reason ? `<p style="margin: 15px 0 0 0; color: #666666; font-size: 14px;"><strong>Reason:</strong> ${details.reason}</p>` : ""}
                      </div>
                      
                      ${
                        isApproved
                          ? `
                        <p style="margin: 25px 0 15px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                          <strong>Your investment is now growing!</strong>
                        </p>
                        
                        <p style="margin: 0 0 25px 0; color: #666666; font-size: 15px; line-height: 1.6;">
                          You can track your investment progress anytime from your dashboard. You'll receive weekly updates on your investment performance.
                        </p>
                      `
                          : `
                        <p style="margin: 25px 0 0 0; color: #666666; font-size: 15px; line-height: 1.6;">
                          Please contact our support team if you have any questions or would like to explore alternative investment options.
                        </p>
                      `
                      }
                      
                      <div style="text-align: center; margin: 35px 0;">
                        <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #1E7B47 0%, #145C33 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                          View Dashboard
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                      <p style="margin: 0; color: #999999; font-size: 14px;">© 2025 FAM 8. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  private static getInvestmentCompletionTemplate(
    userName: string,
    details: {
      productName: string;
      initialAmount: number;
      finalAmount: number;
      roi: number;
    }
  ): string {
    const formatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    });
    const profit = details.finalAmount - details.initialAmount;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Investment Completed</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #1E7B47 0%, #145C33 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">🎊 Congratulations!</h1>
                      <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 18px;">Your Investment is Complete</p>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 22px;">Hello ${userName},</h2>
                      
                      <p style="margin: 0 0 25px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                        Excellent news! Your investment has reached maturity and your returns are now ready to be collected.
                      </p>
                      
                      <div style="background: linear-gradient(135deg, #f0f9f4 0%, #e6f4ea 100%); border-radius: 8px; padding: 30px; margin: 25px 0; text-align: center;">
                        <h3 style="margin: 0 0 20px 0; color: #1E7B47; font-size: 20px;">Investment Summary</h3>
                        
                        <div style="margin: 25px 0;">
                          <p style="margin: 0 0 5px 0; color: #666666; font-size: 14px;">Product</p>
                          <p style="margin: 0; color: #333333; font-size: 18px; font-weight: bold;">${details.productName}</p>
                        </div>
                        
                        <div style="display: inline-block; text-align: center; margin: 20px 15px;">
                          <p style="margin: 0 0 5px 0; color: #666666; font-size: 14px;">Initial Investment</p>
                          <p style="margin: 0; color: #333333; font-size: 20px; font-weight: bold;">${formatter.format(details.initialAmount)}</p>
                        </div>
                        
                        <div style="display: inline-block; text-align: center; margin: 20px 15px;">
                          <p style="margin: 0 0 5px 0; color: #1E7B47; font-size: 14px;">Total Returns</p>
                          <p style="margin: 0; color: #1E7B47; font-size: 28px; font-weight: bold;">${formatter.format(details.finalAmount)}</p>
                        </div>
                        
                        <div style="background-color: #1E7B47; color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
                          <p style="margin: 0; font-size: 16px;">
                            <strong>Profit Earned: ${formatter.format(profit)}</strong> (${details.roi}% ROI)
                          </p>
                        </div>
                      </div>
                      
                      <p style="margin: 25px 0 15px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                        <strong>Next Steps:</strong>
                      </p>
                      
                      <ul style="margin: 0 0 25px 0; color: #666666; font-size: 15px; line-height: 1.8; padding-left: 20px;">
                        <li>Review your investment summary in the dashboard</li>
                        <li>Withdraw your returns or reinvest for compounding growth</li>
                        <li>Explore new investment opportunities</li>
                      </ul>
                      
                      <div style="text-align: center; margin: 35px 0;">
                        <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #1E7B47 0%, #145C33 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                          Collect Your Returns
                        </a>
                      </div>
                      
                      <p style="margin: 25px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6; text-align: center;">
                        Thank you for investing with FAM 8! 🌱
                      </p>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                      <p style="margin: 0; color: #999999; font-size: 14px;">© 2025 FAM 8. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  private static getPaymentReceiptTemplate(
    userName: string,
    details: {
      amount: number;
      transactionId: string;
      productName: string;
      date: Date;
    }
  ): string {
    const formatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Payment Receipt</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #1E7B47 0%, #145C33 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">💳 Payment Receipt</h1>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 22px;">Hello ${userName},</h2>
                      
                      <p style="margin: 0 0 25px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                        Thank you for your payment. Here's your receipt:
                      </p>
                      
                      <div style="border: 2px solid #1E7B47; border-radius: 8px; padding: 25px; margin: 25px 0;">
                        <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
                              <p style="margin: 0; color: #666666; font-size: 14px;">Date</p>
                            </td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; text-align: right;">
                              <p style="margin: 0; color: #333333; font-size: 15px; font-weight: bold;">${details.date.toLocaleDateString()}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
                              <p style="margin: 0; color: #666666; font-size: 14px;">Transaction ID</p>
                            </td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; text-align: right;">
                              <p style="margin: 0; color: #333333; font-size: 13px; font-family: monospace;">${details.transactionId}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
                              <p style="margin: 0; color: #666666; font-size: 14px;">Investment</p>
                            </td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; text-align: right;">
                              <p style="margin: 0; color: #333333; font-size: 15px; font-weight: bold;">${details.productName}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0;">
                              <p style="margin: 0; color: #666666; font-size: 16px; font-weight: bold;">Amount Paid</p>
                            </td>
                            <td style="padding: 12px 0; text-align: right;">
                              <p style="margin: 0; color: #1E7B47; font-size: 24px; font-weight: bold;">${formatter.format(details.amount)}</p>
                            </td>
                          </tr>
                        </table>
                      </div>
                      
                      <p style="margin: 25px 0 15px 0; color: #666666; font-size: 15px; line-height: 1.6;">
                        Your payment has been processed successfully. You can view your investment details in your dashboard.
                      </p>
                      
                      <div style="text-align: center; margin: 35px 0;">
                        <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #1E7B47 0%, #145C33 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                          View Dashboard
                        </a>
                      </div>
                      
                      <div style="background-color: #f8f9fa; padding: 20px; margin: 25px 0; border-radius: 4px; text-align: center;">
                        <p style="margin: 0; color: #666666; font-size: 13px;">
                          Keep this receipt for your records. For any payment inquiries, please contact our support team with your transaction ID.
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                      <p style="margin: 0; color: #999999; font-size: 14px;">© 2025 FAM 8. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  private static getWeeklyProgressReportTemplate(
    userName: string,
    investments: Array<{
      productName: string;
      amount: number;
      progress: number;
      daysRemaining: number;
      status: string;
    }>
  ): string {
    const formatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    });

    const totalInvested = investments.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Weekly Progress Report</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #1E7B47 0%, #145C33 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">📊 Weekly Investment Report</h1>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 22px;">Hello ${userName},</h2>
                      
                      <p style="margin: 0 0 25px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                        Here's your weekly investment progress summary:
                      </p>
                      
                      <div style="background: linear-gradient(135deg, #f0f9f4 0%, #e6f4ea 100%); border-radius: 8px; padding: 25px; margin: 25px 0; text-align: center;">
                        <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">Total Investment Value</p>
                        <p style="margin: 0; color: #1E7B47; font-size: 32px; font-weight: bold;">${formatter.format(totalInvested)}</p>
                      </div>
                      
                      <h3 style="margin: 30px 0 20px 0; color: #333333; font-size: 18px;">Active Investments</h3>
                      
                      ${investments
                        .map(
                          (inv) => `
                        <div style="background-color: #f8f9fa; border-left: 4px solid #1E7B47; padding: 20px; margin: 15px 0; border-radius: 4px;">
                          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <p style="margin: 0; color: #333333; font-size: 16px; font-weight: bold;">${inv.productName}</p>
                            <p style="margin: 0; color: #1E7B47; font-size: 16px; font-weight: bold;">${formatter.format(inv.amount)}</p>
                          </div>
                          
                          <div style="background-color: #e9ecef; height: 8px; border-radius: 4px; margin: 15px 0; overflow: hidden;">
                            <div style="background: linear-gradient(90deg, #1E7B47 0%, #145C33 100%); height: 100%; width: ${inv.progress}%; border-radius: 4px;"></div>
                          </div>
                          
                          <div style="display: flex; justify-content: space-between;">
                            <p style="margin: 0; color: #666666; font-size: 13px;">Progress: <strong>${inv.progress}%</strong></p>
                            <p style="margin: 0; color: #666666; font-size: 13px;">${inv.daysRemaining} days remaining</p>
                          </div>
                        </div>
                      `
                        )
                        .join("")}
                      
                      <div style="background-color: #e7f3ff; padding: 20px; margin: 30px 0; border-radius: 8px; border: 1px solid #b3d9ff;">
                        <p style="margin: 0; color: #0066cc; font-size: 14px; line-height: 1.6;">
                          <strong>💡 Tip:</strong> Your investments are growing! Consider reinvesting your returns when they mature to maximize your profits through compounding.
                        </p>
                      </div>
                      
                      <div style="text-align: center; margin: 35px 0;">
                        <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #1E7B47 0%, #145C33 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                          View Full Details
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                      <p style="margin: 0 0 10px 0; color: #999999; font-size: 14px;">© 2025 FAM 8. All rights reserved.</p>
                      <p style="margin: 0; color: #999999; font-size: 12px;">
                        You're receiving this email because you have active investments. 
                        <a href="${process.env.NEXTAUTH_URL}/profile/notifications" style="color: #1E7B47; text-decoration: none;">Manage preferences</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }
}
