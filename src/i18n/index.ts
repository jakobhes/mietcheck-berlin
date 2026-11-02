import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uiDe from './ui/de';
import uiEn from './ui/en';
import uiAr from './ui/ar';
import featDe from './features/de';
import featEn from './features/en';
import featAr from './features/ar';
import type { FeatureText } from './features/types';

export const LANGUAGES = [
  { code: 'de', label: 'Deutsch', dir: 'ltr' },
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
] as const;

export type Lang = (typeof LANGUAGES)[number]['code'];

const FEATURES: Record<Lang, Record<string, FeatureText>> = { de: featDe, en: featEn, ar: featAr };

const LANG_KEY = 'mietcheck-berlin:lang';

function initialLang(): Lang {
  const stored = localStorage.getItem(LANG_KEY);
  if (stored === 'de' || stored === 'en' || stored === 'ar') return stored;
  const nav = navigator.language.slice(0, 2);
  return nav === 'ar' ? 'ar' : nav === 'en' ? 'en' : 'de';
}

export function applyDocumentLang(lang: Lang): void {
  const def = LANGUAGES.find((l) => l.code === lang)!;
  document.documentElement.lang = lang;
  document.documentElement.dir = def.dir;
  localStorage.setItem(LANG_KEY, lang);
}

void i18n.use(initReactI18next).init({
  resources: {
    de: { translation: uiDe },
    en: { translation: uiEn },
    ar: { translation: uiAr },
  },
  lng: initialLang(),
  fallbackLng: 'de',
  interpolation: { escapeValue: false },
});

applyDocumentLang(i18n.language as Lang);
i18n.on('languageChanged', (lng) => applyDocumentLang(lng as Lang));

/** Frage + Erläuterung zu einem Merkmal in der gewählten Sprache (Fallback Deutsch). */
export function featureText(lang: string, id: string, de: string): FeatureText {
  const l = (lang in FEATURES ? lang : 'de') as Lang;
  const t = FEATURES[l][id] ?? FEATURES.de[id] ?? { q: de, help: '' };
  // Energiekennwerte: Grenzwert aus dem Originalwortlaut übernehmen
  const n = /(\d+) kWh/.exec(de)?.[1];
  return n ? { q: t.q.replace('{{n}}', n), help: t.help } : t;
}

export { FEATURES };
export default i18n;
