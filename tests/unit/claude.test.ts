import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCreate = vi.fn();
vi.mock('@anthropic-ai/sdk', () => ({
  default: class Anthropic {
    messages = { create: mockCreate };
  },
}));

const { classifyText, suggestWorkflow } = await import('@lib/claude');

beforeEach(() => {
  mockCreate.mockReset();
});

describe('classifyText', () => {
  it('returns parsed fields on valid JSON response', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: '{"type":"Research Ops","complexity":"Medium","tools":["Claude","Python"],"timeline":"2-4 weeks","tags":["bilingual","structured"]}' }],
    });
    const result = await classifyText('A project description about research automation.');
    expect(result.ok).toBe(true);
    expect(result.fields!.type).toBe('Research Ops');
    expect(result.fields!.tools).toContain('Claude');
  });

  it('returns error on malformed JSON', async () => {
    mockCreate.mockResolvedValue({ content: [{ type: 'text', text: 'not valid json' }] });
    const result = await classifyText('some input');
    expect(result.ok).toBe(false);
    expect(result.code).toBe(500);
  });

  it('handles API errors', async () => {
    mockCreate.mockRejectedValue(new Error('API down'));
    const result = await classifyText('some input');
    expect(result.ok).toBe(false);
    expect(result.code).toBe(503);
  });
});

describe('suggestWorkflow', () => {
  it('returns text response', async () => {
    mockCreate.mockResolvedValue({ content: [{ type: 'text', text: '§ Recommended approach\n...\n' }] });
    const result = await suggestWorkflow('I have 500 PDFs to classify.');
    expect(result.ok).toBe(true);
    expect(result.text).toContain('Recommended approach');
  });

  it('handles API errors', async () => {
    mockCreate.mockRejectedValue(new Error('timeout'));
    const result = await suggestWorkflow('some input');
    expect(result.ok).toBe(false);
  });
});
