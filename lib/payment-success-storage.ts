const STORAGE_KEY = 'anantastro:payment-success';

export type PaymentSuccessSnapshot = {
  orderId: string;
  paymentId: string;
  signature: string;
  planName: string;
  coinQuantity: number;
  amountPaise: number;
  currency: string;
  balance?: number;
  verified?: boolean;
};

export function savePaymentSuccessSnapshot(snapshot: PaymentSuccessSnapshot): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function readPaymentSuccessSnapshot(): PaymentSuccessSnapshot | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PaymentSuccessSnapshot;
  } catch {
    return null;
  }
}

export function clearPaymentSuccessSnapshot(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
}
