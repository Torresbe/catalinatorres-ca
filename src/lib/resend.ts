import { Resend } from 'resend';

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
