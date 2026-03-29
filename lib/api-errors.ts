import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function parseFetchBaseError(e: unknown): {
  status?: number;
  message?: string;
  code?: string;
  balance?: number;
  required?: number;
} {
  if (typeof e !== 'object' || e === null || !('status' in e)) {
    return {};
  }
  const fe = e as FetchBaseQueryError;
  const status = typeof fe.status === 'number' ? fe.status : undefined;
  let data: unknown = fe.data;
  if (typeof data === 'string') {
    const raw = data;
    try {
      data = JSON.parse(raw) as unknown;
    } catch {
      return { status, message: raw };
    }
  }
  if (typeof data !== 'object' || data === null) {
    return { status };
  }
  const d = data as Record<string, unknown>;
  return {
    status,
    message: typeof d.message === 'string' ? d.message : undefined,
    code: typeof d.code === 'string' ? d.code : undefined,
    balance: typeof d.balance === 'number' ? d.balance : undefined,
    required: typeof d.required === 'number' ? d.required : undefined,
  };
}
