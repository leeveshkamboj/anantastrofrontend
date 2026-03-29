'use client';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(!!window.Razorpay));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    s.onload = () => resolve(!!window.Razorpay);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function openRazorpayCheckout(options: {
  keyId: string;
  orderId: string;
  currency: string;
  name: string;
  description: string;
  userEmail?: string;
  userName?: string;
  onSuccess?: (paymentId: string, orderId: string, signature: string) => void;
  onDismiss?: () => void;
}): void {
  if (!window.Razorpay) {
    options.onDismiss?.();
    return;
  }
  const rzp = new window.Razorpay({
    key: options.keyId,
    currency: options.currency,
    order_id: options.orderId,
    name: options.name,
    description: options.description,
    prefill: {
      email: options.userEmail,
      name: options.userName,
    },
    theme: { color: '#7c3aed' },
    handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
      options.onSuccess?.(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
    },
    modal: {
      ondismiss: () => options.onDismiss?.(),
    },
  });
  rzp.open();
}
