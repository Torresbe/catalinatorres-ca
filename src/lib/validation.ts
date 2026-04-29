import type { ErrorCode } from './errors';

export interface ValidationResult {
  ok: boolean;
  code?: ErrorCode;
  field?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_SUBMIT_MS = 2000;

export interface ContactInput {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  website: string;
  submittedAfterMs: number;
}

export function validateContact(input: ContactInput): ValidationResult {
  if (input.website.trim() !== '') return { ok: false, code: 403, field: 'honeypot', message: 'bot detected' };
  if (input.submittedAfterMs < MIN_SUBMIT_MS) return { ok: false, code: 403, field: 'timing', message: 'submitted too quickly' };
  if (!input.name.trim()) return { ok: false, code: 400, field: 'name', message: 'name required' };
  if (!EMAIL_RE.test(input.email.trim())) return { ok: false, code: 400, field: 'email', message: 'valid email required' };
  if (!input.subject.trim()) return { ok: false, code: 400, field: 'subject', message: 'subject required' };
  const msg = input.message.trim();
  if (msg.length < 10) return { ok: false, code: 400, field: 'message', message: 'message too short' };
  if (msg.length > 3000) return { ok: false, code: 413, field: 'message', message: 'message too long' };
  return { ok: true };
}

export function validateDemoInput(text: string, maxChars: number): ValidationResult {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, code: 400, message: 'input required' };
  if (trimmed.length > maxChars) return { ok: false, code: 413, message: 'input too long' };
  return { ok: true };
}
