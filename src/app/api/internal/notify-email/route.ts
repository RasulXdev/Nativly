import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/client'
import {
  bookingConfirmed,
  lessonReminder,
  lessonCancelled,
} from '@/lib/email/templates'

type EmailKind = 'booking_confirmed' | 'lesson_reminder' | 'lesson_cancelled'

interface Payload {
  kind: EmailKind
  to: string
  recipientName: string
  counterpartName: string
  scheduledAt: string
  reason?: string
}

/**
 * Best-effort transactional email dispatcher, called from the client right
 * after a booking write succeeds. No-ops gracefully when RESEND_API_KEY is
 * unset (see src/lib/email/client.ts).
 */
export async function POST(req: Request) {
  let body: Payload
  try {
    body = (await req.json()) as Payload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { kind, to, recipientName, counterpartName, scheduledAt, reason } = body
  if (!kind || !to || !scheduledAt) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const base = { recipientName, counterpartName, scheduledAt }
  const tpl =
    kind === 'booking_confirmed'
      ? bookingConfirmed(base)
      : kind === 'lesson_reminder'
        ? lessonReminder(base)
        : lessonCancelled({ ...base, reason })

  const result = await sendEmail({ to, subject: tpl.subject, html: tpl.html })
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 })
  }
  return NextResponse.json({ ok: true, skipped: 'skipped' in result ? result.skipped : false })
}
