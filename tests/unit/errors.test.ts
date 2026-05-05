import { describe, it, expect } from 'vitest';
import { errorMessages } from '@lib/errors';

describe('errorMessages 429', () => {
  it('en 429 contains opening line and two links', () => {
    const msg = errorMessages.en[429];
    expect(msg).toContain('I gave you everything');
    expect(msg).toContain('href="https://www.linkedin.com/in/catalina-torres-benjumea-3a64a523/"');
    expect(msg).toContain('target="_blank"');
    expect(msg).toContain('rel="noopener noreferrer"');
    expect(msg).toContain('href="/contact"');
    expect(msg).toContain('LinkedIn →');
    expect(msg).toContain('Email →');
  });

  it('es 429 contains opening line and two links pointing to /es/contacto', () => {
    const msg = errorMessages.es[429];
    expect(msg).toContain('Te di todo lo que tenía');
    expect(msg).toContain('href="https://www.linkedin.com/in/catalina-torres-benjumea-3a64a523/"');
    expect(msg).toContain('href="/es/contacto"');
    expect(msg).toContain('LinkedIn →');
    expect(msg).toContain('Email →');
  });

  it('does not mention "letter" / "carta" anymore in 429', () => {
    expect(errorMessages.en[429]).not.toMatch(/letter/i);
    expect(errorMessages.es[429]).not.toMatch(/carta/i);
  });
});
