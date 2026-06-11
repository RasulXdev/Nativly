import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { AZN_TO_USD_RATE } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  amount: number,
  currency: string = 'USD',
  locale: string = 'az'
): string {
  if (currency === 'AZN') {
    return `${(amount / AZN_TO_USD_RATE).toFixed(2)} ₼`
  }
  return new Intl.NumberFormat(locale === 'az' ? 'az-AZ' : locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date, locale: string = 'az'): string {
  return new Intl.DateTimeFormat(locale === 'az' ? 'az-AZ' : locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date, locale: string = 'az'): string {
  return new Intl.DateTimeFormat(locale === 'az' ? 'az-AZ' : locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatTime(date: string | Date, locale: string = 'az'): string {
  return new Intl.DateTimeFormat(locale === 'az' ? 'az-AZ' : locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function generateRoomId(lessonId: string): string {
  return `lesson_${lessonId}`
}

export function isLessonJoinable(scheduledAt: string): boolean {
  const now = new Date()
  const lessonTime = new Date(scheduledAt)
  const diffMs = lessonTime.getTime() - now.getTime()
  const diffMin = diffMs / (1000 * 60)
  return diffMin <= 15 && diffMin >= -90
}

export function getInitialsFromName(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export type CancellationTier = 'free' | 'half' | 'full'

/**
 * Cancellation policy (NATIVLY §5.4):
 *   24h+   → free (lesson credit refunded)
 *   12-24h → 50% charge (no refund)
 *   <12h   → full charge (no refund)
 */
export function getCancellationTier(scheduledAt: string | Date): CancellationTier {
  const hoursUntil =
    (new Date(scheduledAt).getTime() - Date.now()) / (1000 * 60 * 60)
  if (hoursUntil >= 24) return 'free'
  if (hoursUntil >= 12) return 'half'
  return 'full'
}

export function cancellationTierMessage(tier: CancellationTier): string {
  switch (tier) {
    case 'free':
      return 'Pulsuz ləğv — dərs krediti geri qaytarılacaq.'
    case 'half':
      return 'Dərsə 24 saatdan az qalıb — dərs krediti geri qaytarılmayacaq (50% tutulur).'
    case 'full':
      return 'Dərsə 12 saatdan az qalıb — dərs krediti tam tutulacaq.'
  }
}

/** Short, human-readable timezone label, e.g. "GMT+4 (Asia/Baku)". */
export function timezoneLabel(timezone?: string | null): string {
  const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  try {
    const offset = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'shortOffset',
    })
      .formatToParts(new Date())
      .find((p) => p.type === 'timeZoneName')?.value
    return offset ? `${offset} (${tz})` : tz
  } catch {
    return tz
  }
}
