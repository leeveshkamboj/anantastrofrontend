// Frontend currency utilities

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  exchangeRateToINR: number;
}

// This should match backend currencies
export const CURRENCIES: Record<string, CurrencyInfo> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    exchangeRateToINR: 1,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    exchangeRateToINR: 0.012,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    exchangeRateToINR: 0.011,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    exchangeRateToINR: 0.0095,
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    exchangeRateToINR: 0.018,
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    exchangeRateToINR: 0.016,
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    name: 'UAE Dirham',
    exchangeRateToINR: 0.044,
  },
  SAR: {
    code: 'SAR',
    symbol: '﷼',
    name: 'Saudi Riyal',
    exchangeRateToINR: 0.045,
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    exchangeRateToINR: 0.016,
  },
};

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const fromInfo = CURRENCIES[fromCurrency.toUpperCase()];
  const toInfo = CURRENCIES[toCurrency.toUpperCase()];

  if (!fromInfo || !toInfo) {
    return amount;
  }

  const amountInINR = amount / fromInfo.exchangeRateToINR;
  const convertedAmount = amountInINR * toInfo.exchangeRateToINR;

  return Math.round(convertedAmount * 100) / 100;
}

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = CURRENCIES[currencyCode.toUpperCase()];
  if (!currency) {
    return `${amount.toFixed(2)} ${currencyCode}`;
  }

  if (currencyCode === 'INR') {
    return `${currency.symbol}${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else {
    return `${currency.symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

export function getCurrencyInfo(currencyCode: string): CurrencyInfo | null {
  return CURRENCIES[currencyCode.toUpperCase()] || null;
}

export function getAllCurrencies(): CurrencyInfo[] {
  return Object.values(CURRENCIES);
}
