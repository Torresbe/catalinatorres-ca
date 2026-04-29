import { describe, it, expect } from 'vitest';
import { validateContact, validateDemoInput } from '@lib/validation';

describe('validateContact', () => {
  it('passes a fully-valid submission', () => {
    const result = validateContact({
      name: 'Jane Doe',
      email: 'jane@example.com',
      subject: 'Hello',
      message: 'This is a valid message with enough characters.',
      website: '',
      submittedAfterMs: 3000,
    });
    expect(result.ok).toBe(true);
  });

  it('fails when honeypot field is filled', () => {
    const result = validateContact({
      name: 'Jane', email: 'jane@example.com', subject: 'Hi',
      message: 'This is a valid message with enough characters.',
      website: 'https://bot.example.com',
      submittedAfterMs: 3000,
    });
    expect(result.ok).toBe(false);
    expect(result.code).toBe(403);
  });

  it('fails when submitted too quickly (bot)', () => {
    const result = validateContact({
      name: 'Jane', email: 'jane@example.com', subject: 'Hi',
      message: 'This is a valid message with enough characters.',
      website: '',
      submittedAfterMs: 500,
    });
    expect(result.ok).toBe(false);
    expect(result.code).toBe(403);
  });

  it('fails on missing name', () => {
    const result = validateContact({
      name: '', email: 'jane@example.com', subject: 'Hi',
      message: 'This is a valid message with enough characters.',
      website: '',
      submittedAfterMs: 3000,
    });
    expect(result.ok).toBe(false);
    expect(result.code).toBe(400);
  });

  it('fails on invalid email', () => {
    const result = validateContact({
      name: 'Jane', email: 'not-an-email', subject: 'Hi',
      message: 'This is a valid message with enough characters.',
      website: '',
      submittedAfterMs: 3000,
    });
    expect(result.ok).toBe(false);
    expect(result.code).toBe(400);
  });

  it('fails on short message', () => {
    const result = validateContact({
      name: 'Jane', email: 'jane@example.com', subject: 'Hi',
      message: 'short',
      website: '',
      submittedAfterMs: 3000,
    });
    expect(result.ok).toBe(false);
    expect(result.code).toBe(400);
  });

  it('fails on oversized message', () => {
    const result = validateContact({
      name: 'Jane', email: 'jane@example.com', subject: 'Hi',
      message: 'x'.repeat(3001),
      website: '',
      submittedAfterMs: 3000,
    });
    expect(result.ok).toBe(false);
    expect(result.code).toBe(413);
  });
});

describe('validateDemoInput', () => {
  it('passes non-empty text within length', () => {
    const result = validateDemoInput('a valid paragraph.', 3000);
    expect(result.ok).toBe(true);
  });

  it('fails on empty', () => {
    const result = validateDemoInput('   ', 3000);
    expect(result.ok).toBe(false);
    expect(result.code).toBe(400);
  });

  it('fails on oversize', () => {
    const result = validateDemoInput('x'.repeat(3001), 3000);
    expect(result.ok).toBe(false);
    expect(result.code).toBe(413);
  });
});
