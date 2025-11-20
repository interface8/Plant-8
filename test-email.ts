// Load environment variables FIRST before any other imports
import dotenv from "dotenv";
dotenv.config();

async function testEmail() {
  // Debug: Check if env vars are loaded
  console.log("🔍 Checking environment variables...");
  console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY ? "✅ Set" : "❌ Not set");
  console.log("SENDGRID_API_KEY:", process.env.SENDGRID_API_KEY ? "✅ Set" : "❌ Not set");
  console.log("EMAIL_FROM:", process.env.EMAIL_FROM || "❌ Not set");
  console.log("");

  // Import EmailService AFTER env vars are loaded
  const { EmailService } = await import("@/lib/services/email-service");
  console.log("🧪 Testing Email System...\n");

  // 1. Check configured providers
  console.log("📋 Step 1: Checking configured providers...");
  const providers = EmailService.getConfiguredProviders();
  
  if (providers.length === 0) {
    console.log("❌ No email providers configured!");
    console.log("💡 Make sure you have at least one of these in your .env:");
    console.log("   - RESEND_API_KEY");
    console.log("   - SENDGRID_API_KEY");
    console.log("   - SMTP_HOST, SMTP_USER, SMTP_PASS");
    return;
  }
  
  console.log("✅ Configured providers:", providers.join(", "));
  console.log("");

  // 2. Send test email
  console.log("📧 Step 2: Sending test email...");
  console.log("⏳ Please wait...");
  
  const success = await EmailService.sendEmail({
    to: "8interface@gmail.com", // ← Replace with your actual email address
    subject: "🎉 Test Email from Plant-8",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1E7B47;">🎉 Success!</h1>
        <p>Your email system is working correctly.</p>
        <p><strong>Provider:</strong> Multi-provider email system</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <hr style="border: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="color: #666; font-size: 14px;">
          This is a test email from your Plant-8 application.
        </p>
      </div>
    `,
  });

  console.log("");

  if (success) {
    console.log("✅ Email sent successfully!");
    console.log("📬 Check your inbox (and spam folder)");
  } else {
    console.log("❌ Email failed to send");
    console.log("💡 Check the error messages above for details");
  }

  console.log("");

  // 3. Check provider statistics
  console.log("📊 Step 3: Provider statistics...");
  const stats = EmailService.getProviderStats();
  
  if (Object.keys(stats).length === 0) {
    console.log("ℹ️  No statistics yet (first run)");
  } else {
    console.log("Provider Stats:", JSON.stringify(stats, null, 2));
  }

  console.log("");
  console.log("🎉 Test complete!");
}

// Run the test
testEmail().catch((error) => {
  console.error("❌ Test failed with error:", error);
  process.exit(1);
});
