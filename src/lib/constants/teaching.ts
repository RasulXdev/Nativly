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
// live now; the rest are surfaced as "coming soon".
export const TEACHING_LANGUAGES = [
  { code: 'en', flag: '🇬🇧', available: true },
  { code: 'ru', flag: '🇷🇺', available: true },
  { code: 'tr', flag: '🇹🇷', available: false },
  { code: 'de', flag: '🇩🇪', available: false },
  { code: 'fr', flag: '🇫🇷', available: false },
  { code: 'es', flag: '🇪🇸', available: false },
  { code: 'it', flag: '🇮🇹', available: false },
  { code: 'ar', flag: '🇸🇦', available: false },
  { code: 'zh', flag: '🇨🇳', available: false },
  { code: 'ja', flag: '🇯🇵', available: false },
  { code: 'ko', flag: '🇰🇷', available: false },
  { code: 'az', flag: '🇦🇿', available: false },
] as const
