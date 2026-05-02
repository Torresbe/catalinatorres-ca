import Anthropic from '@anthropic-ai/sdk';
import type { ErrorCode } from './errors';

const MODEL = 'claude-haiku-4-5-20251001';

function client() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
}

export interface ClassifyResult {
  ok: boolean;
  fields?: {
    type: string;
    complexity: string;
    tools: string[];
    timeline: string;
    tags: string[];
  };
  code?: ErrorCode;
}

const CLASSIFY_SYSTEM = `You are a project taxonomist. Given a description of a project or problem, classify it into five fixed fields. Return ONLY a JSON object with these keys: type (string), complexity (string: "Small" | "Medium" | "Large"), tools (string[]), timeline (string: rough estimate like "2-4 weeks"), tags (string[]: 2-5 short tags). No commentary, no markdown, only JSON. If input is in Spanish, output values in Spanish except for tool names.`;

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

export async function classifyText(input: string): Promise<ClassifyResult> {
  try {
    const res = await client().messages.create({
      model: MODEL,
      max_tokens: 400,
      system: CLASSIFY_SYSTEM,
      messages: [{ role: 'user', content: input }],
    });
    const block = res.content[0];
    if (block.type !== 'text') return { ok: false, code: 500 };
    const parsed = extractJSON(block.text);
    return { ok: true, fields: parsed as ClassifyResult['fields'] };
  } catch (err) {
    if (err instanceof SyntaxError) return { ok: false, code: 500 };
    return { ok: false, code: 503 };
  }
}

export type FlowNodeType = 'trigger' | 'ai' | 'action' | 'data' | 'condition' | 'output';

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

export interface Flow {
  summary: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  estimate: string;
}

export interface WorkflowResult {
  ok: boolean;
  flow?: Flow;
  code?: ErrorCode;
}

const NODE_TYPES: ReadonlySet<string> = new Set([
  'trigger', 'ai', 'action', 'data', 'condition', 'output',
]);

const WORKFLOW_SYSTEM = `You are a workflow consultant for AI-assisted automation. Given an operational problem, design a concrete n8n-style workflow as a directed graph.

Return ONLY a JSON object matching this schema:
{
  "summary": string (1-2 sentence overview, plain text),
  "nodes": Array<{ "id": string, "type": "trigger"|"ai"|"action"|"data"|"condition"|"output", "label": string (≤40 chars, format like "Service: brief action") }>,
  "edges": Array<{ "from": string (node id), "to": string (node id), "label"?: string (≤20 chars, only for branches) }>,
  "estimate": string (effort range, e.g. "2-4 hours setup")
}

Rules:
- 3 to 7 nodes. Always start with a trigger node and end with an output node.
- Node ids: "n1", "n2", "n3"… Edges connect existing ids only (no orphans).
- Prefer linear flows. Use branches only when truly conditional (then add edge labels like "yes"/"no").
- Tool examples: trigger(webhook, schedule, folder watch), ai(Claude, embeddings), action(HTTP request, transform), data(read DB, write sheet), condition(if/switch), output(send email, notify slack, write file).
- If the user writes in Spanish, write summary, labels, estimate and edge labels in Spanish (keep tool/service names in English).
- No commentary, no markdown, only the JSON object.`;

function validateFlow(raw: unknown): Flow {
  if (!raw || typeof raw !== 'object') throw new SyntaxError('flow not an object');
  const f = raw as Record<string, unknown>;
  if (typeof f.summary !== 'string' || typeof f.estimate !== 'string') throw new SyntaxError('summary/estimate missing');
  if (!Array.isArray(f.nodes) || f.nodes.length === 0) throw new SyntaxError('nodes missing/empty');
  if (!Array.isArray(f.edges)) throw new SyntaxError('edges missing');

  const ids = new Set<string>();
  const nodes: FlowNode[] = f.nodes.map((n) => {
    if (!n || typeof n !== 'object') throw new SyntaxError('node not an object');
    const node = n as Record<string, unknown>;
    if (typeof node.id !== 'string' || typeof node.label !== 'string' || typeof node.type !== 'string') {
      throw new SyntaxError('node missing fields');
    }
    if (!NODE_TYPES.has(node.type)) throw new SyntaxError(`unknown node type: ${node.type}`);
    if (ids.has(node.id)) throw new SyntaxError(`duplicate node id: ${node.id}`);
    ids.add(node.id);
    return { id: node.id, type: node.type as FlowNodeType, label: node.label };
  });

  const edges: FlowEdge[] = f.edges.map((e) => {
    if (!e || typeof e !== 'object') throw new SyntaxError('edge not an object');
    const edge = e as Record<string, unknown>;
    if (typeof edge.from !== 'string' || typeof edge.to !== 'string') throw new SyntaxError('edge missing from/to');
    if (!ids.has(edge.from) || !ids.has(edge.to)) throw new SyntaxError('edge references unknown node');
    const out: FlowEdge = { from: edge.from, to: edge.to };
    if (typeof edge.label === 'string') out.label = edge.label;
    return out;
  });

  return { summary: f.summary, nodes, edges, estimate: f.estimate };
}

export async function suggestWorkflow(input: string): Promise<WorkflowResult> {
  try {
    const res = await client().messages.create({
      model: MODEL,
      max_tokens: 800,
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
