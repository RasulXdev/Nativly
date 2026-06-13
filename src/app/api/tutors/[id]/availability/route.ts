import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const DAY_KEYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const

/** Granularity between bookable start times (e.g. 7:00, 7:10, 7:20 …). */
const STEP_MINUTES = 10
/** Default lesson length a slot must accommodate. */
const LESSON_MINUTES = 30
/** Breathing room after each lesson before the next can start. */
const BUFFER_MINUTES = 10

/** "HH:MM[:SS]" -> minutes since midnight */
function toMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/**
 * Convert a wall-clock time (HH:MM) on a given date in a named timezone to a
 * UTC ISO string. Uses a one-step offset correction via Intl — accurate for
 * all IANA timezones including DST transitions.
 */
function localToUTC(dateStr: string, localTime: string, tz: string): string {
  const [h, m] = localTime.split(':').map(Number)
  const naiveUTC = new Date(`${dateStr}T${pad(h)}:${pad(m)}:00Z`)
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
      .formatToParts(naiveUTC)
      .map((p) => [p.type, p.value])
  )
  const gotMin = (parseInt(parts.hour) % 24) * 60 + parseInt(parts.minute)
  const wantMin = h * 60 + m
  return new Date(naiveUTC.getTime() + (wantMin - gotMin) * 60_000).toISOString()
}

/** Minutes-since-midnight of an instant, read in a specific timezone. */
function minutesInTimezone(iso: string, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date(iso))
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? '0')
  const m = Number(parts.find((p) => p.type === 'minute')?.value ?? '0')
  return (h % 24) * 60 + m
}

/**
 * GET /api/tutors/[id]/availability?date=YYYY-MM-DD
 * Returns bookable start times (10-min granularity) for a 30-min lesson on a
 * given date, with booked / blocked / past slots marked unavailable.
 */
export async function GET(
  req: NextRequest,
  ctx: RouteContext<'/api/tutors/[id]/availability'>
) {
  const { id: tutorId } = await ctx.params
  const dateStr = req.nextUrl.searchParams.get('date')

  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return NextResponse.json(
      { error: 'date query param (YYYY-MM-DD) required' },
      { status: 400 }
    )
  }

  const db = createAdminClient()

  // Tutor profile + owner timezone.
  const { data: tutor } = await db
    .from('tutor_profiles')
    .select('id, user_id, profiles!tutor_profiles_user_id_fkey(timezone)')
    .eq('id', tutorId)
    .maybeSingle()

  if (!tutor) {
    return NextResponse.json({ error: 'Tutor not found' }, { status: 404 })
  }

  const timezone =
    (tutor as { profiles?: { timezone?: string | null } }).profiles?.timezone ??
    'Asia/Baku'

  const dayKey = DAY_KEYS[new Date(`${dateStr}T12:00:00`).getUTCDay()]

  // Weekly working hours for that weekday.
  const { data: availRows } = await db
    .from('tutor_availability')
    .select('start_time, end_time, is_active')
    .eq('tutor_id', tutorId)
    .eq('day_of_week', dayKey)
    .eq('is_active', true)

  // Day-level / time-ranged blocks.
  const { data: unavailRows } = await db
    .from('tutor_unavailability')
    .select('start_time, end_time')
    .eq('tutor_id', tutorId)
    .eq('date', dateStr)

  const dayStart = `${dateStr}T00:00:00`
  const dayEnd = `${dateStr}T23:59:59`

  // Existing reservations (bookings + lessons) for that day.
  const [{ data: bookings }, { data: lessons }] = await Promise.all([
    db
      .from('bookings')
      .select('scheduled_at, duration_minutes, status')
      .eq('tutor_id', tutorId)
      .in('status', ['pending', 'confirmed'])
      .gte('scheduled_at', dayStart)
      .lte('scheduled_at', dayEnd),
    db
      .from('lessons')
      .select('scheduled_at, duration_minutes, status')
      .eq('tutor_id', tutorId)
      .in('status', ['scheduled', 'in_progress'])
      .gte('scheduled_at', dayStart)
      .lte('scheduled_at', dayEnd),
  ])

  // Busy intervals [start, end) in local clock minutes of the stored timestamp.
  const busyIntervals: { start: number; end: number }[] = []
  const addBusy = (rows: { scheduled_at: string; duration_minutes: number }[] | null) => {
    for (const r of rows ?? []) {
      const startMin = minutesInTimezone(r.scheduled_at, timezone)
      const dur = r.duration_minutes || LESSON_MINUTES
      // Reserve lesson duration + buffer so back-to-back bookings get a breather.
      busyIntervals.push({ start: startMin, end: startMin + dur + BUFFER_MINUTES })
    }
  }
  addBusy(bookings)
  addBusy(lessons)

  /** Does a candidate lesson [m, m+LESSON_MINUTES) overlap any busy interval? */
  const overlapsBusy = (m: number) =>
    busyIntervals.some((b) => m < b.end && m + LESSON_MINUTES > b.start)

  // Full-day block?
  const fullDayBlocked = (unavailRows ?? []).some(
    (u) => !u.start_time && !u.end_time
  )

  // "Today" + current minute, evaluated in the tutor's timezone.
  const todayInTz = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
  const nowMinSameDay =
    todayInTz === dateStr ? minutesInTimezone(new Date().toISOString(), timezone) : -1

  const slots: { time: string; available: boolean; utc: string }[] = []

  if (!fullDayBlocked) {
    for (const row of availRows ?? []) {
      const start = toMinutes(row.start_time)
      const end = toMinutes(row.end_time)
      // A start is valid while the full lesson still fits inside the window.
      for (let m = start; m + LESSON_MINUTES <= end; m += STEP_MINUTES) {
        const time = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`
        // Blocked if the lesson would overlap a time-ranged unavailability.
        const inBlock = (unavailRows ?? []).some((u) => {
          if (!u.start_time || !u.end_time) return false
          return m < toMinutes(u.end_time) && m + LESSON_MINUTES > toMinutes(u.start_time)
        })
        const available =
          !overlapsBusy(m) && !inBlock && (nowMinSameDay < 0 || m > nowMinSameDay)
        slots.push({ time, available, utc: localToUTC(dateStr, time, timezone) })
      }
    }
  }

  // De-dup + sort (overlapping availability windows).
  const seen = new Map<string, { available: boolean; utc: string }>()
  for (const s of slots) {
    const prev = seen.get(s.time)
    seen.set(s.time, { available: (prev?.available ?? false) || s.available, utc: s.utc })
  }
  const merged = [...seen.entries()]
    .map(([time, { available, utc }]) => ({ time, available, utc }))
    .sort((a, b) => a.time.localeCompare(b.time))

  return NextResponse.json({ timezone, date: dateStr, slots: merged })
}
