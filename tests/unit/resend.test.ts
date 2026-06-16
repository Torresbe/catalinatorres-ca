import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSend = vi.fn();
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: mockSend };
  },
}));

const { sendContactEmail, sendLabNotification } = await import('@lib/resend');

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

describe('sendLabNotification', () => {
  const flow = {
    hook: 'Mira, puedes ahorrar 5 horas por semana clasificando PDFs haciendo esto:',
    steps: ['Pones los PDFs en una carpeta.', 'Un asistente los lee y extrae hallazgos.'],
    closer: 'Pasas de leer 500 PDFs a revisar una tabla.',
    nodes: [{ id: 'n1', type: 'trigger' as const, label: 'Carpeta' }],
    edges: [],
    review: {
      confidence: 'medium' as const,
      assumptions: ['Los PDFs tienen texto seleccionable.'],
      risks: ['Si son escaneos, falla.'],
      humanCheck: 'Confirmar cuántos son escaneos.',
    },
  };

  it('sends to CONTACT_EMAIL from the notify address', async () => {
    mockSend.mockResolvedValue({ data: { id: 'x' }, error: null });
    const result = await sendLabNotification({ input: 'Tengo 500 PDFs para clasificar.', flow });
    expect(result.ok).toBe(true);
    expect(mockSend).toHaveBeenCalledOnce();
    const call = mockSend.mock.calls[0][0];
    expect(call.to).toBe('test@example.com');
    expect(call.from).toBe('notify@catatorres.ca');
    expect(call.subject).toContain('lab');
  });

  it('includes the visitor problem and the generated hook in the body', async () => {
    mockSend.mockResolvedValue({ data: { id: 'x' }, error: null });
    await sendLabNotification({ input: 'Tengo 500 PDFs para clasificar.', flow });
    const body = mockSend.mock.calls[0][0].text;
    expect(body).toContain('Tengo 500 PDFs para clasificar.');
    expect(body).toContain('ahorrar 5 horas');
  });

  it('surfaces the editor confidence when a review is present', async () => {
    mockSend.mockResolvedValue({ data: { id: 'x' }, error: null });
    await sendLabNotification({ input: 'problema', flow });
    const call = mockSend.mock.calls[0][0];
    expect(`${call.subject} ${call.text}`).toContain('medium');
  });

  it('still sends when the flow has no review', async () => {
    mockSend.mockResolvedValue({ data: { id: 'x' }, error: null });
    const { review: _r, ...flowNoReview } = flow;
    const result = await sendLabNotification({ input: 'problema', flow: flowNoReview });
    expect(result.ok).toBe(true);
  });

  it('returns error on failure', async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: 'fail' } });
    const result = await sendLabNotification({ input: 'problema', flow });
    expect(result.ok).toBe(false);
  });
});
