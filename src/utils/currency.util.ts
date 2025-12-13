export class CurrencyUtil {
  /**
   * Format currency to USD with millions
   * @param value - The value to format
   * @returns Formatted string like "$6.7 Million"
   */
  static formatCurrencyMillion(value: number): string {
    const millions = value / 1_000_000;
    return `$${millions.toFixed(1)} Million`;
  }
}
