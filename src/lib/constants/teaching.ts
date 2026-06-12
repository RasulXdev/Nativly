// Stable specialization value keys — language-agnostic so they apply to ALL
// taught languages (English, Russian, German, … 12 total), not just English.
// The display label is resolved via i18n: t(`specs.${value}`).
export const SPECIALIZATIONS = [
  'conversation',
  'grammar',
  'business',
  'kids',
  'examPrep',
  'pronunciation',
  'writing',
  'interview',
  'beginner',
  'intensive',
] as const

export type Specialization = (typeof SPECIALIZATIONS)[number]

// Languages taught on the platform. `available: true` means tutors/lessons are
// live now; the rest are surfaced as "coming soon". `name` is the native
// endonym used for marketing surfaces (homepage, auth panel); UI-localized
// names are resolved separately via t(`langNames.${code}`).
// Single source of truth — the homepage, auth shell and tutor onboarding all
// derive their language list from here so they never drift apart.
export const TEACHING_LANGUAGES = [
  { code: 'en', flag: '🇬🇧', name: 'English', available: true },
  { code: 'ru', flag: '🇷🇺', name: 'Русский', available: true },
  { code: 'tr', flag: '🇹🇷', name: 'Türkçe', available: false },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch', available: false },
  { code: 'fr', flag: '🇫🇷', name: 'Français', available: false },
  { code: 'es', flag: '🇪🇸', name: 'Español', available: false },
  { code: 'it', flag: '🇮🇹', name: 'Italiano', available: false },
  { code: 'ar', flag: '🇸🇦', name: 'العربية', available: false },
  { code: 'zh', flag: '🇨🇳', name: '中文', available: false },
  { code: 'ja', flag: '🇯🇵', name: '日本語', available: false },
  { code: 'ko', flag: '🇰🇷', name: '한국어', available: false },
] as const
