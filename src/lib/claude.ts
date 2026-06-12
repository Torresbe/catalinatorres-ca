import Anthropic from '@anthropic-ai/sdk';
import type { ErrorCode } from './errors';

const MODEL = 'claude-haiku-4-5-20251001';

function client() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
}

function extractJSON(text: string): unknown {
  const trimmed = text.trim();
  try { return JSON.parse(trimmed); } catch {}
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fence) return JSON.parse(fence[1].trim());
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start !== -1 && end > start) return JSON.parse(trimmed.slice(start, end + 1));
  throw new SyntaxError('No JSON found in response');
}

export type FlowNodeType = 'trigger' | 'action' | 'result';

export interface FlowNode {
  id: string;
  type: FlowNodeType;
  label: string;
}

export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
}

export type ReviewConfidence = 'high' | 'medium' | 'low';

export interface EditorReview {
  confidence: ReviewConfidence;
  assumptions: string[];
  risks: string[];
  humanCheck: string;
}

export interface Flow {
  hook: string;
  steps: string[];
  closer: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  review?: EditorReview;
}

export interface WorkflowResult {
  ok: boolean;
  flow?: Flow;
  code?: ErrorCode;
}

const NODE_TYPES: ReadonlySet<string> = new Set(['trigger', 'action', 'result']);
const CONFIDENCE_LEVELS: ReadonlySet<string> = new Set(['high', 'medium', 'low']);

const FORBIDDEN_BRANDS = /\b(claude|chatgpt|chat-?gpt|gpt-?\d?|perplexity|openai|anthropic|gemini|bard|copilot|llama|mistral|cohere)\b/i;

const WORKFLOW_SYSTEM = `You are a sales-savvy automation consultant writing for non-technical decision-makers. Given an operational problem, design a workflow and pitch it in a persuasive, plain-spoken voice.

Return ONLY a JSON object matching this schema:
{
  "hook": string,
  "steps": string[],
  "closer": string,
  "nodes": Array<{ "id": string, "type": "trigger"|"action"|"result", "label": string }>,
  "edges": Array<{ "from": string, "to": string }>,
  "review": { "confidence": "high"|"medium"|"low", "assumptions": string[], "risks": string[], "humanCheck": string }
}

Field rules:
- hook (Spanish): "Mira, puedes ahorrar [N horas] por semana para [problema reformulado del usuario] haciendo esto:"
  hook (English): "Look, you can save [N hours] per week on [restated user problem] by doing this:"
  Estimate hours/week realistically based on the described volume and frequency.
- steps: 3 to 5 plain-language steps. No tool names, no jargon, no acronyms. Use phrases like "asistente inteligente" / "smart assistant", "automatización" / "automation", "un sistema que analiza y genera" / "a system that analyzes and produces". Each step ≤ 28 words. Sound like a friend explaining, not a product page.
- closer: one short sentence. What concretely changes day-to-day if this is implemented. Vivid, not abstract.
- nodes: 3 to 5 nodes. Always exactly 1 "trigger" first, 1+ "result" last, "action" in between. Labels ≤ 32 chars, plain language, NO brand names.
- edges: connect node ids ("n1" → "n2" → "n3"...) to form a linear DAG. Reference existing ids only.
- review: after drafting the workflow, reread it as a skeptical editor annotating someone else's manuscript. Honest, not promotional — a "low" with good reasons reads as more credible than empty confidence.
  - confidence: how well the workflow fits given ONLY what the user actually said. "high" only when volume, formats and frequency are stated or safely inferable. "medium" when one major unknown remains. "low" when the problem is underspecified. This field is ALWAYS one of the three English enum values, regardless of language.
  - assumptions: 2-3 things the draft silently assumed (volumes, formats, languages, systems already in place). Each ≤ 25 words.
  - risks: 1-3 concrete points where this flow breaks in practice. Not generic disclaimers — specific to THIS problem. Each ≤ 25 words.
  - humanCheck: the single most important thing to verify with a person before building anything. One sentence.

Language: detect the input language. If Spanish, ALL string fields in Spanish. If English, ALL in English.

ABSOLUTELY FORBIDDEN in any field — even as examples: the words "Claude", "ChatGPT", "GPT", "Perplexity", "OpenAI", "Anthropic", "Gemini", "Copilot", "LLM", or any AI brand or model name. Use generic terms only.

No commentary, no markdown, only the JSON object.`;

function ensureClean(value: string, where: string): void {
  if (FORBIDDEN_BRANDS.test(value)) throw new SyntaxError(`forbidden brand in ${where}`);
}

function validateReview(raw: unknown): EditorReview {
  if (!raw || typeof raw !== 'object') throw new SyntaxError('review not an object');
  const r = raw as Record<string, unknown>;
  if (typeof r.confidence !== 'string' || !CONFIDENCE_LEVELS.has(r.confidence)) {
    throw new SyntaxError(`unknown confidence: ${r.confidence}`);
  }
  if (typeof r.humanCheck !== 'string' || r.humanCheck.length === 0) throw new SyntaxError('humanCheck missing');
  ensureClean(r.humanCheck, 'review humanCheck');

  const lists: { key: 'assumptions' | 'risks'; value: unknown }[] = [
    { key: 'assumptions', value: r.assumptions },
    { key: 'risks', value: r.risks },
  ];
  const [assumptions, risks] = lists.map(({ key, value }) => {
    if (!Array.isArray(value) || value.length === 0) throw new SyntaxError(`review ${key} missing/empty`);
    return value.map((s, i) => {
      if (typeof s !== 'string') throw new SyntaxError(`review ${key} ${i} not a string`);
      ensureClean(s, `review ${key} ${i}`);
      return s;
    });
  });

  return { confidence: r.confidence as ReviewConfidence, assumptions, risks, humanCheck: r.humanCheck };
}

function validateFlow(raw: unknown): Flow {
  if (!raw || typeof raw !== 'object') throw new SyntaxError('flow not an object');
  const f = raw as Record<string, unknown>;
  if (typeof f.hook !== 'string' || typeof f.closer !== 'string') throw new SyntaxError('hook/closer missing');
  if (!Array.isArray(f.steps) || f.steps.length === 0) throw new SyntaxError('steps missing/empty');
  if (!Array.isArray(f.nodes) || f.nodes.length === 0) throw new SyntaxError('nodes missing/empty');
  if (!Array.isArray(f.edges)) throw new SyntaxError('edges missing');

  ensureClean(f.hook, 'hook');
  ensureClean(f.closer, 'closer');

  const steps: string[] = f.steps.map((s, i) => {
    if (typeof s !== 'string') throw new SyntaxError(`step ${i} not a string`);
    ensureClean(s, `step ${i}`);
    return s;
  });

  const ids = new Set<string>();
  const nodes: FlowNode[] = f.nodes.map((n) => {
    if (!n || typeof n !== 'object') throw new SyntaxError('node not an object');
    const node = n as Record<string, unknown>;
    if (typeof node.id !== 'string' || typeof node.label !== 'string' || typeof node.type !== 'string') {
      throw new SyntaxError('node missing fields');
    }
    if (!NODE_TYPES.has(node.type)) throw new SyntaxError(`unknown node type: ${node.type}`);
    if (ids.has(node.id)) throw new SyntaxError(`duplicate node id: ${node.id}`);
    ensureClean(node.label, `node ${node.id} label`);
    ids.add(node.id);
    return { id: node.id, type: node.type as FlowNodeType, label: node.label };
  });

  const edges: FlowEdge[] = f.edges.map((e) => {
    if (!e || typeof e !== 'object') throw new SyntaxError('edge not an object');
    const edge = e as Record<string, unknown>;
    if (typeof edge.from !== 'string' || typeof edge.to !== 'string') throw new SyntaxError('edge missing from/to');
    if (!ids.has(edge.from) || !ids.has(edge.to)) throw new SyntaxError('edge references unknown node');
    const out: FlowEdge = { from: edge.from, to: edge.to };
    if (typeof edge.label === 'string') {
      ensureClean(edge.label, 'edge label');
      out.label = edge.label;
    }
    return out;
  });

  const flow: Flow = { hook: f.hook, steps, closer: f.closer, nodes, edges };
  // A missing review degrades gracefully (the flow renders without the
  // editor's note) so a formatting slip doesn't burn one of the user's
  // 3 rate-limited attempts. A present-but-invalid review still rejects.
  if (f.review !== undefined) flow.review = validateReview(f.review);
  return flow;
}

export async function suggestWorkflow(input: string): Promise<WorkflowResult> {
  try {
    const res = await client().messages.create({
      model: MODEL,
      max_tokens: 1400,
      system: WORKFLOW_SYSTEM,
      messages: [{ role: 'user', content: input }],
    });
    const block = res.content[0];
    if (block.type !== 'text') return { ok: false, code: 500 };
    const parsed = extractJSON(block.text);
    const flow = validateFlow(parsed);
    return { ok: true, flow };
  } catch (err) {
    if (err instanceof SyntaxError) return { ok: false, code: 500 };
    return { ok: false, code: 503 };
  }
}
