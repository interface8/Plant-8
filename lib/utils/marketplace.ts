import { Product } from '@/types/product';

/**
 * Suggests a listing price for a product based on market conditions.
 * @param product The product to list.
 * @param inflationRate The current inflation rate.
 * @param demandFactor A multiplier for current demand (e.g., 1.2 for high demand).
 * @param platformFee The platform's fee percentage.
 * @returns The suggested price per kg.
 */
export function suggestListingPrice(
  product: Product,
  inflationRate: number,
  demandFactor = 1,
  platformFee = 5
): number {
  const adjusted = (product.currentMarketPricePerKg || 0) * (1 + inflationRate) * demandFactor;
  return +(adjusted * (1 + platformFee / 100)).toFixed(2);
}

/**
 * Calculates the net earnings for a seller after platform fees.
 * @param totalValue The total value of the sale.
 * @param platformFee The platform's fee percentage.
 * @returns An object with the fee amount and the net earnings.
 */
export function calculateNetEarnings(
  totalValue: number,
  platformFee: number
): { fee: number; netEarnings: number } {
  const fee = (platformFee / 100) * totalValue;
  return { fee, netEarnings: totalValue - fee };
}
