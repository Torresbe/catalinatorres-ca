import { Resend } from 'resend';
import type { Flow } from './claude';

export interface ContactEmailInput {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}

export interface SendResult {
  ok: boolean;
  code?: number;
}

export async function sendContactEmail(input: ContactEmailInput): Promise<SendResult> {
  const client = new Resend(process.env.RESEND_API_KEY!);
  const to = process.env.CONTACT_EMAIL!;
  const body = [
    `NAME: ${input.name}`,
    `EMAIL: ${input.email}`,
    `COMPANY: ${input.company || '—'}`,
    `SUBJECT: ${input.subject}`,
    '',
    'MESSAGE:',
    input.message,
    '',
    '───',
    'sent via catatorres.ca/contact',
  ].join('\n');

  const { error } = await client.emails.send({
    from: 'notify@catatorres.ca',
    to,
    replyTo: input.email,
    subject: `[catatorres] ${input.subject}`,
    text: body,
  });

  if (error) return { ok: false, code: 503 };
  return { ok: true };
}

export interface LabNotificationInput {
  input: string;
  flow: Flow;
}

export async function sendLabNotification(payload: LabNotificationInput): Promise<SendResult> {
  const client = new Resend(process.env.RESEND_API_KEY!);
  const to = process.env.CONTACT_EMAIL!;
  const { input, flow } = payload;

  const lines = [
    'A visitor ran the Lab workflow suggester.',
    '',
    'THEIR PROBLEM:',
    input,
    '',
    '───',
    `HOOK: ${flow.hook}`,
    '',
    'STEPS:',
    ...flow.steps.map((s, i) => `${i + 1}. ${s}`),
    '',
    `CLOSER: ${flow.closer}`,
  ];

  if (flow.review) {
    lines.push(
      '',
      '───',
      `EDITOR — confidence: ${flow.review.confidence}`,
      '',
      'Assumptions:',
      ...flow.review.assumptions.map((s) => `- ${s}`),
      '',
      'Risks:',
      ...flow.review.risks.map((s) => `- ${s}`),
      '',
      `Human check: ${flow.review.humanCheck}`,
    );
  }

  lines.push('', '───', 'sent via catatorres.ca/lab');

  const subjectSuffix = flow.review ? ` (${flow.review.confidence} confidence)` : '';
  const { error } = await client.emails.send({
    from: 'notify@catatorres.ca',
    to,
    subject: `[catatorres] lab — new suggested workflow${subjectSuffix}`,
    text: lines.join('\n'),
  });

  if (error) return { ok: false, code: 503 };
  return { ok: true };
}
