export function formatCurrency(amount?: string | number | null): string {
  if (!amount) return 'N/A'
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(numericAmount)) return 'N/A'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numericAmount)
}

const ALPHA2_REGEX = /^[A-Z]{3}$/;

export function isValidCountryCode(code: string): boolean {
  if (!code || typeof code !== "string") return false;
  return ALPHA2_REGEX.test(code.toUpperCase());
}

export function generateUniqueRandomNumbers(
  count: number,
  min: number,
  max: number,
): number[] {
  if (max - min + 1 < count) {
    throw new Error("Range is too small");
  }

  const uniqueNumbers = new Set<number>();

  while (uniqueNumbers.size < count) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    uniqueNumbers.add(randomNum);
  }

  return Array.from(uniqueNumbers);
}

export const rules = {
  required: (value: string) => !!value || "Date Required",

  datePattern: (value: string) => {
    const pattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    return pattern.test(value) || "Format YYYY-MM-DD (Example: 2026-09-23).";
  },

  validDate: (value: string) => {
    if (!value) return true;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    const isValid =
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day;

    return isValid || "Invalid date (calendar error).";
  },
};
