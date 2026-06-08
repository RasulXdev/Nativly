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
