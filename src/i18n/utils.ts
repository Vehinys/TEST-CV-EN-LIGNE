import fr from './fr.json';
import en from './en.json';

export type Lang = 'fr' | 'en';

const translations: Record<Lang, Record<string, string>> = { fr, en };

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return 'fr';
}

export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    return translations[lang][key] ?? translations['fr'][key] ?? key;
  };
}

export function getAlternateLangPath(url: URL): string {
  const lang = getLangFromUrl(url);
  if (lang === 'en') {
    return url.pathname.replace(/^\/en/, '') || '/';
  }
  return `/en${url.pathname}`;
}
