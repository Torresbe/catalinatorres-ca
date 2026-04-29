import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSend = vi.fn();
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: mockSend };
  },
}));

const { sendContactEmail } = await import('@lib/resend');

beforeEach(() => {
  mockSend.mockReset();
  process.env.RESEND_API_KEY = 'test-key';
  process.env.CONTACT_EMAIL = 'test@example.com';
});

describe('sendContactEmail', () => {
  it('sends email with correct fields', async () => {
    mockSend.mockResolvedValue({ data: { id: 'email-id' }, error: null });
    const result = await sendContactEmail({
      name: 'Jane Doe',
      email: 'jane@example.com',
      subject: 'Hello',
      message: 'Test message',
    });
    expect(result.ok).toBe(true);
    expect(mockSend).toHaveBeenCalledOnce();
    const call = mockSend.mock.calls[0][0];
    expect(call.to).toBe('test@example.com');
    expect(call.replyTo).toBe('jane@example.com');
    expect(call.subject).toContain('Hello');
  });

  it('returns error on failure', async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: 'fail' } });
    const result = await sendContactEmail({
      name: 'Jane', email: 'jane@example.com', subject: 'Hi', message: 'msg',
    });
    expect(result.ok).toBe(false);
  });
});
