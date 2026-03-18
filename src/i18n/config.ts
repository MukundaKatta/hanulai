export const locales = ['en', 'ko', 'ja', 'hi'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
  ja: '日本語',
  hi: 'हिन्दी',
};

export const localeFlags: Record<Locale, string> = {
  en: 'US',
  ko: 'KR',
  ja: 'JP',
  hi: 'IN',
};
