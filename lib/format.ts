import { CONVERSION_RATES } from './constants';

export function formatINR(amount: number): string {
  if (amount >= 10_000_000) {
    return `₹${(amount / 10_000_000).toFixed(2)} Cr`;
  }
  if (amount >= 100_000) {
    return `₹${(amount / 100_000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatUSD(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

export function convertToUSD(inrAmount: number): number {
  return Math.round(inrAmount * CONVERSION_RATES.INR_TO_USD);
}

export function formatSalary(amount: number, currency: string, displayCurrency: string): string {
  if (amount === 0) return '—';
  if (currency === 'INR') {
    if (displayCurrency === 'USD') return formatUSD(convertToUSD(amount));
    return formatINR(amount);
  }
  if (currency === 'USD') {
    if (displayCurrency === 'INR') return formatINR(Math.round(amount * CONVERSION_RATES.USD_TO_INR));
    return formatUSD(amount);
  }
  return `${amount.toLocaleString()}`;
}

export function computeMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid];
}
