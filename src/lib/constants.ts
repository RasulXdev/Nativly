export const LOCALES = ['az', 'en', 'ru'] as const
export const DEFAULT_LOCALE = 'az'

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  registerTutor: '/register/tutor',
  forgotPassword: '/forgot-password',
  dashboard: '/dashboard',
  tutors: '/tutors',
  schedule: '/schedule',
  lessons: '/lessons',
  messages: '/messages',
  wallet: '/wallet',
  settings: '/settings',
  tutorDashboard: '/tutor-dashboard',
  tutorSchedule: '/tutor-schedule',
  tutorStudents: '/tutor-students',
  tutorEarnings: '/tutor-earnings',
  tutorSettings: '/tutor-settings',
  admin: '/admin',
} as const

export const COMMISSION_RATE = 0.2 // 20%

export const LESSON_DURATIONS = [30, 60] as const

export const CANCELLATION_POLICY = {
  FREE_CANCEL_HOURS: 24,
  HALF_REFUND_HOURS: 12,
} as const

export const CURRENCIES = ['USD', 'AZN'] as const
export const AZN_TO_USD_RATE = 0.59

export const MIN_WITHDRAWAL = 50

export const DEPOSIT_PRESETS = [10, 25, 50, 100] as const
