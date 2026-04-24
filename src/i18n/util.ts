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

/** Map an EN path to its ES counterpart (or vice versa). */
export function translatePath(pathname: string, target: Lang): string {
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
  if (target === 'es') return routes[pathname] ?? '/es';
  return reverse[pathname] ?? '/';
}
