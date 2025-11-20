# Plant-8

Digitize farming

## 📧 Email System

This project includes a **flexible multi-provider email notification system** with automatic failover and load balancing.

### Features
- ✅ 9 email notification types (welcome, password reset, investments, payments, etc.)
- ✅ Support for multiple providers (Resend, SendGrid, SMTP)
- ✅ Automatic failover when providers fail
- ✅ Load balancing across providers
- ✅ Provider health monitoring
- ✅ Professional HTML templates
- ✅ Device tracking and alerts

### Quick Start
```bash
# Install email providers (choose one or more)
npm install resend @sendgrid/mail nodemailer
npm install -D @types/nodemailer

# Configure environment
cp .env.email.example .env
# Add your API keys to .env

# Run migration
npx prisma migrate dev --name add_email_notifications
npx prisma generate
```

### Documentation
📚 **Complete documentation in [`docs/`](./docs/)**

**Start here:** [Quick Start Guide](./docs/QUICK_START_MULTI_PROVIDER.md)

Other guides:
- [Provider Comparison](./docs/PROVIDER_COMPARISON.md) - Choose the right setup
- [Architecture Overview](./docs/MULTI_PROVIDER_SUMMARY.md) - How it works
- [Integration Guide](./docs/EMAIL_IMPLEMENTATION.md) - Code examples
- [Complete Reference](./docs/MULTI_PROVIDER_EMAIL.md) - All features

### Usage Example
```typescript
import { EmailService } from "@/lib/services/email-service";

// Send welcome email (automatically uses configured providers)
await EmailService.sendWelcomeEmail(user.email, user.name);

// Check configured providers
const providers = EmailService.getConfiguredProviders();
console.log(providers); // ["Resend", "SendGrid"]

// Monitor provider health
const stats = EmailService.getProviderStats();
console.log(stats);
```

---
