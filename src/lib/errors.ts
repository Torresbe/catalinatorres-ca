export type ErrorCode = 400 | 401 | 403 | 404 | 413 | 415 | 429 | 500 | 503 | 504;

type Messages = Record<ErrorCode, string>;

// 429 contains inline HTML anchors. Renderers interpolate the message via ${msg}
// without escaping; non-429 codes are plain strings.
export const errorMessages: Record<'en' | 'es', Messages> = {
  en: {
    400: 'the manuscript is blank. write something.',
    401: 'no one invited you. but you can knock →',
    403: 'this chapter is private.',
    404: 'you are looking in the wrong place.',
    413: 'this is a book, not a note. trim it.',
    415: 'words only. no runes.',
    429: 'I gave you everything. <a href="https://www.linkedin.com/in/catalina-torres-benjumea-3a64a523/" target="_blank" rel="noopener noreferrer">LinkedIn →</a> or <a href="/contact">Email →</a> for more',
    500: 'this draft needs revision. standby.',
    503: 'the office is closed for now. try nicer.',
    504: "the pigeon didn't return. try again.",
  },
  es: {
    400: 'el manuscrito está en blanco. escribe algo.',
    401: 'nadie te invitó. pero puedes tocar la puerta →',
    403: 'este capítulo es privado.',
    404: 'estás buscando en el lugar equivocado.',
    413: 'esto es un libro, no una nota. recórtalo.',
    415: 'solo palabras. nada de runas.',
    429: 'Te di todo lo que tenía. <a href="https://www.linkedin.com/in/catalina-torres-benjumea-3a64a523/" target="_blank" rel="noopener noreferrer">LinkedIn →</a> o <a href="/es/contacto">Email →</a> para más',
    500: 'este borrador necesita revisión. espera.',
    503: 'la oficina está cerrada ahora. intenta mejor.',
    504: 'la paloma no regresó. intenta de nuevo.',
  },
};

export function getErrorMessage(lang: 'en' | 'es', code: ErrorCode): string {
  return errorMessages[lang][code];
}
