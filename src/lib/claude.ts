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
    const parsed = JSON.parse(block.text);
    return { ok: true, fields: parsed };
  } catch (err) {
    if (err instanceof SyntaxError) return { ok: false, code: 500 };
    return { ok: false, code: 503 };
  }
}

export interface WorkflowResult {
  ok: boolean;
  text?: string;
  code?: ErrorCode;
}

const WORKFLOW_SYSTEM = `You are a workflow consultant for AI-assisted automation. The user describes an operational problem; you suggest a concrete workflow in three labeled sections. Use this exact format:

§ Recommended approach
  ─────────────────────
  [1-2 sentence summary]

§ Tools
  ─────
  [1] ...
  [2] ...
  [3] ...

§ Estimated effort
  ────────────────
  [time estimate]

If the user writes in Spanish, respond in Spanish. Keep total response under 300 words. No commentary outside this format.`;

export async function suggestWorkflow(input: string): Promise<WorkflowResult> {
  try {
    const res = await client().messages.create({
      model: MODEL,
      max_tokens: 600,
      system: WORKFLOW_SYSTEM,
      messages: [{ role: 'user', content: input }],
    });
    const block = res.content[0];
    if (block.type !== 'text') return { ok: false, code: 500 };
    return { ok: true, text: block.text };
  } catch {
    return { ok: false, code: 503 };
  }
}
