/**
 * Email System Diagnostic Tool
 * 
 * This script checks:
 * 1. Environment variables
 * 2. Provider configuration
 * 3. Actual email sending
 */

import dotenv from "dotenv";
dotenv.config();

async function diagnoseEmailSystem() {
  console.log("🔍 EMAIL SYSTEM DIAGNOSTICS\n");
  console.log("=" .repeat(50));
  
  // Step 1: Check environment variables
  console.log("\n1️⃣  ENVIRONMENT VARIABLES");
  console.log("-".repeat(50));
  
  const resendKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;
  const strategy = process.env.EMAIL_STRATEGY;
  
  console.log(`✓ RESEND_API_KEY: ${resendKey ? `${resendKey.substring(0, 10)}...` : '❌ NOT SET'}`);
  console.log(`✓ EMAIL_FROM: ${emailFrom || '❌ NOT SET'}`);
  console.log(`✓ EMAIL_STRATEGY: ${strategy || 'failover (default)'}`);
  
  if (!resendKey || !emailFrom) {
    console.log("\n❌ CRITICAL: Missing required environment variables!");
    console.log("Please set RESEND_API_KEY and EMAIL_FROM in your .env file");
    return;
  }
  
  // Step 2: Check provider configuration
  console.log("\n2️⃣  PROVIDER CONFIGURATION");
  console.log("-".repeat(50));
  
  // Dynamic import after env vars are loaded
  const { EmailService } = await import("./lib/services/email-service");
  
  const providers = EmailService.getConfiguredProviders();
  console.log(`✓ Configured providers: ${providers.join(", ")}`);
  
  if (providers.length === 0) {
    console.log("\n❌ CRITICAL: No email providers configured!");
    return;
  }
  
  // Step 3: Test email sending
  console.log("\n3️⃣  TESTING EMAIL SEND");
  console.log("-".repeat(50));
  
  const testEmail = process.env.TEST_EMAIL || "test@example.com";
  console.log(`📧 Attempting to send test email to: ${testEmail}`);
  console.log(`📤 From: ${emailFrom}`);
  
  try {
    const result = await EmailService.sendWelcomeEmail(testEmail, "Test User");
    
    if (result) {
      console.log("\n✅ EMAIL SENT SUCCESSFULLY!");
      console.log("\nNext steps:");
      console.log("1. Check the recipient inbox (including spam/promotions)");
      console.log("2. Check Resend dashboard: https://resend.com/emails");
      console.log("3. Check EmailLog table in your database (npx prisma studio)");
    } else {
      console.log("\n❌ EMAIL SEND FAILED!");
      console.log("The function returned false - check provider logs");
    }
  } catch (error) {
    console.log("\n❌ EMAIL SEND ERROR!");
    console.log("Error:", error instanceof Error ? error.message : error);
  }
  
  // Step 4: Show provider statistics
  console.log("\n4️⃣  PROVIDER STATISTICS");
  console.log("-".repeat(50));
  
  const stats = EmailService.getProviderStats();
  console.log(JSON.stringify(stats, null, 2));
  
  console.log("\n" + "=".repeat(50));
  console.log("✅ DIAGNOSTIC COMPLETE\n");
}

diagnoseEmailSystem().catch(console.error);
