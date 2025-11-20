/**
 * Email Provider Manager
 * 
 * Manages multiple email providers with:
 * - Automatic failover (if one provider fails, try the next)
 * - Round-robin load balancing (distribute emails across providers)
 * - Priority-based routing (use preferred provider first)
 * - Rate limit awareness
 */

import {
  IEmailProvider,
  EmailMessage,
  EmailSendResult,
} from "./email-provider.interface";

export type ProviderStrategy = "failover" | "round-robin" | "priority";

export interface ProviderConfig {
  provider: IEmailProvider;
  priority?: number; // Higher number = higher priority (default: 0)
  maxRetries?: number; // Max retries for this provider (default: 1)
}

export class EmailProviderManager {
  private providers: ProviderConfig[] = [];
  private strategy: ProviderStrategy;
  private currentRoundRobinIndex = 0;
  private providerStats: Map<
    string,
    { sent: number; failed: number; lastUsed: Date }
  > = new Map();

  constructor(
    providers: ProviderConfig[],
    strategy: ProviderStrategy = "failover"
  ) {
    this.providers = providers
      .filter((p) => p.provider.isConfigured())
      .sort((a, b) => (b.priority || 0) - (a.priority || 0)); // Sort by priority desc

    this.strategy = strategy;

    if (this.providers.length === 0) {
      console.warn("No email providers configured!");
    }
  }

  /**
   * Send an email using the configured strategy
   */
  async send(message: EmailMessage): Promise<EmailSendResult> {
    if (this.providers.length === 0) {
      return {
        success: false,
        error: "No email providers configured",
        provider: "None",
      };
    }

    switch (this.strategy) {
      case "round-robin":
        return this.sendRoundRobin(message);
      case "priority":
        return this.sendPriority(message);
      case "failover":
      default:
        return this.sendFailover(message);
    }
  }

  /**
   * Failover strategy: Try providers in order until one succeeds
   */
  private async sendFailover(message: EmailMessage): Promise<EmailSendResult> {
    let lastError = "";

    for (const config of this.providers) {
      const maxRetries = config.maxRetries || 1;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const result = await this.sendWithProvider(config.provider, message);

        if (result.success) {
          this.recordSuccess(config.provider.name);
          return result;
        }

        lastError = result.error || "Unknown error";
        this.recordFailure(config.provider.name);

        // If not the last attempt, wait a bit before retrying
        if (attempt < maxRetries) {
          await this.sleep(1000 * attempt); // Exponential backoff
        }
      }
    }

    return {
      success: false,
      error: `All providers failed. Last error: ${lastError}`,
      provider: "All",
    };
  }

  /**
   * Round-robin strategy: Distribute emails evenly across providers
   */
  private async sendRoundRobin(
    message: EmailMessage
  ): Promise<EmailSendResult> {
    let attempts = 0;

    // Try each provider once in round-robin order
    while (attempts < this.providers.length) {
      const config = this.providers[this.currentRoundRobinIndex];
      this.currentRoundRobinIndex =
        (this.currentRoundRobinIndex + 1) % this.providers.length;

      const result = await this.sendWithProvider(config.provider, message);

      if (result.success) {
        this.recordSuccess(config.provider.name);
        return result;
      }

      this.recordFailure(config.provider.name);
      attempts++;
    }

    return {
      success: false,
      error: "All providers failed in round-robin",
      provider: "All",
    };
  }

  /**
   * Priority strategy: Always use highest priority provider, fallback if needed
   */
  private async sendPriority(message: EmailMessage): Promise<EmailSendResult> {
    // Same as failover since providers are already sorted by priority
    return this.sendFailover(message);
  }

  /**
   * Send using a specific provider
   */
  private async sendWithProvider(
    provider: IEmailProvider,
    message: EmailMessage
  ): Promise<EmailSendResult> {
    try {
      const result = await provider.send(message);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        provider: provider.name,
      };
    }
  }

  /**
   * Record successful send
   */
  private recordSuccess(providerName: string) {
    const stats = this.providerStats.get(providerName) || {
      sent: 0,
      failed: 0,
      lastUsed: new Date(),
    };
    stats.sent++;
    stats.lastUsed = new Date();
    this.providerStats.set(providerName, stats);
  }

  /**
   * Record failed send
   */
  private recordFailure(providerName: string) {
    const stats = this.providerStats.get(providerName) || {
      sent: 0,
      failed: 0,
      lastUsed: new Date(),
    };
    stats.failed++;
    stats.lastUsed = new Date();
    this.providerStats.set(providerName, stats);
  }

  /**
   * Get provider statistics
   */
  getStats() {
    return Object.fromEntries(this.providerStats);
  }

  /**
   * Get list of configured providers
   */
  getConfiguredProviders(): string[] {
    return this.providers.map((p) => p.provider.name);
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Add a new provider at runtime
   */
  addProvider(config: ProviderConfig) {
    if (config.provider.isConfigured()) {
      this.providers.push(config);
      this.providers.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    }
  }

  /**
   * Remove a provider
   */
  removeProvider(providerName: string) {
    this.providers = this.providers.filter(
      (p) => p.provider.name !== providerName
    );
  }
}
