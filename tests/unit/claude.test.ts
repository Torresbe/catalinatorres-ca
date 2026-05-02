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

  it('parses JSON wrapped in ```json markdown fences', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: '```json\n{"type":"Research","complexity":"Medium","tools":["Claude"],"timeline":"1 week","tags":["t1"]}\n```' }],
    });
    const result = await classifyText('input');
    expect(result.ok).toBe(true);
    expect(result.fields!.type).toBe('Research');
  });

  it('parses JSON wrapped in plain ``` fences', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: '```\n{"type":"X","complexity":"Small","tools":[],"timeline":"1d","tags":[]}\n```' }],
    });
    const result = await classifyText('input');
    expect(result.ok).toBe(true);
    expect(result.fields!.type).toBe('X');
  });

  it('parses JSON when model adds preamble text before the object', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: 'Here is the classification:\n{"type":"Y","complexity":"Large","tools":["a"],"timeline":"1 mo","tags":["x"]}' }],
    });
    const result = await classifyText('input');
    expect(result.ok).toBe(true);
    expect(result.fields!.type).toBe('Y');
  });

  it('handles API errors', async () => {
    mockCreate.mockRejectedValue(new Error('API down'));
    const result = await classifyText('some input');
    expect(result.ok).toBe(false);
    expect(result.code).toBe(503);
  });
});

describe('suggestWorkflow', () => {
  const validFlow = {
    hook: 'Mira, puedes ahorrar 5 horas por semana clasificando PDFs académicos haciendo esto:',
    steps: [
      'Pones todos los PDFs en una carpeta y un sistema los detecta automáticamente.',
      'Un asistente inteligente lee cada documento y extrae los hallazgos clave.',
      'Los resultados aparecen en una hoja de cálculo lista para revisar.',
    ],
    closer: 'Pasas de leer 500 PDFs uno por uno a revisar una sola tabla con todo lo importante.',
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Carpeta con PDFs' },
      { id: 'n2', type: 'action', label: 'Asistente extrae hallazgos' },
      { id: 'n3', type: 'result', label: 'Hoja de cálculo lista' },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
    ],
  };

  it('returns parsed flow on valid JSON response', async () => {
    mockCreate.mockResolvedValue({ content: [{ type: 'text', text: JSON.stringify(validFlow) }] });
    const result = await suggestWorkflow('Tengo 500 PDFs para clasificar.');
    expect(result.ok).toBe(true);
    expect(result.flow!.hook).toContain('ahorrar');
    expect(result.flow!.steps).toHaveLength(3);
    expect(result.flow!.closer).toContain('revisar');
    expect(result.flow!.nodes).toHaveLength(3);
    expect(result.flow!.nodes[0].type).toBe('trigger');
    expect(result.flow!.nodes[2].type).toBe('result');
  });

  it('parses flow wrapped in markdown fences', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: '```json\n' + JSON.stringify(validFlow) + '\n```' }],
    });
    const result = await suggestWorkflow('input');
    expect(result.ok).toBe(true);
  });

  it('returns error 500 on malformed JSON', async () => {
    mockCreate.mockResolvedValue({ content: [{ type: 'text', text: 'not valid json' }] });
    const result = await suggestWorkflow('input');
    expect(result.ok).toBe(false);
    expect(result.code).toBe(500);
  });

  it('returns error 500 when hook is missing', async () => {
    const { hook: _hook, ...rest } = validFlow;
    mockCreate.mockResolvedValue({ content: [{ type: 'text', text: JSON.stringify(rest) }] });
    const result = await suggestWorkflow('input');
    expect(result.ok).toBe(false);
    expect(result.code).toBe(500);
  });

  it('returns error 500 when steps is empty', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: JSON.stringify({ ...validFlow, steps: [] }) }],
    });
    const result = await suggestWorkflow('input');
    expect(result.ok).toBe(false);
    expect(result.code).toBe(500);
  });

  it('returns error 500 when nodes array is empty', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: JSON.stringify({ ...validFlow, nodes: [] }) }],
    });
    const result = await suggestWorkflow('input');
    expect(result.ok).toBe(false);
    expect(result.code).toBe(500);
  });

  it('returns error 500 when edge references unknown node id', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: JSON.stringify({ ...validFlow, edges: [{ from: 'n1', to: 'nX' }] }) }],
    });
    const result = await suggestWorkflow('input');
    expect(result.ok).toBe(false);
    expect(result.code).toBe(500);
  });

  it('returns error 500 when output mentions a forbidden AI brand (Claude)', async () => {
    const polluted = { ...validFlow, steps: [...validFlow.steps, 'Claude lee los PDFs.'] };
    mockCreate.mockResolvedValue({ content: [{ type: 'text', text: JSON.stringify(polluted) }] });
    const result = await suggestWorkflow('input');
    expect(result.ok).toBe(false);
    expect(result.code).toBe(500);
  });

  it('returns error 500 when a node label mentions ChatGPT', async () => {
    const polluted = {
      ...validFlow,
      nodes: [...validFlow.nodes.slice(0, 2), { id: 'n3', type: 'result', label: 'ChatGPT writes summary' }],
    };
    mockCreate.mockResolvedValue({ content: [{ type: 'text', text: JSON.stringify(polluted) }] });
    const result = await suggestWorkflow('input');
    expect(result.ok).toBe(false);
    expect(result.code).toBe(500);
  });

  it('handles API errors', async () => {
    mockCreate.mockRejectedValue(new Error('timeout'));
    const result = await suggestWorkflow('some input');
    expect(result.ok).toBe(false);
    expect(result.code).toBe(503);
  });
});
