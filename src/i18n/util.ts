import en from './en.json';
import es from './es.json';

export type Lang = 'en' | 'es';

const dictionaries = { en, es };

export function getLangFromUrl(url: URL): Lang {
  return url.pathname.startsWith('/es') ? 'es' : 'en';
}

export function t(lang: Lang) {
  return dictionaries[lang];
}

/** Strip the language prefix folder from a project entry id to get its shared slug. */
export function projectSlugFromId(id: string): string {
  return id.startsWith('es/') ? id.slice(3) : id;
}

/** Map an EN path to its ES counterpart (or vice versa). */
export function translatePath(pathname: string, target: Lang): string {
  const clean = pathname.replace(/\/$/, '') || '/';
  const routes: Record<string, string> = {
    '/': '/es',
    '/services': '/es/servicios',
    '/projects': '/es/proyectos',
    '/lab': '/es/lab',
    '/about': '/es/sobre-mi',
    '/contact': '/es/contacto',
    '/privacy': '/es/privacidad',
  };
  const reverse = Object.fromEntries(Object.entries(routes).map(([en, es]) => [es, en]));

  // Dynamic project pages share a slug across languages.
  const enProjectMatch = clean.match(/^\/projects\/(.+)$/);
  if (enProjectMatch) return target === 'es' ? `/es/proyectos/${enProjectMatch[1]}` : clean;
  const esProjectMatch = clean.match(/^\/es\/proyectos\/(.+)$/);
  if (esProjectMatch) return target === 'en' ? `/projects/${esProjectMatch[1]}` : clean;

  if (target === 'es') return routes[clean] ?? '/es';
  return reverse[clean] ?? '/';
}
