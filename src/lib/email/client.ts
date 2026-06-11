import { Resend } from 'resend'

/**
 * Lazy Resend client. The whole module is a graceful no-op until
 * RESEND_API_KEY (and a verified sender domain) are configured —
 * so the booking flow never breaks before email is wired up.
 */
let client: Resend | null = null

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  if (!client) client = new Resend(key)
  return client
}

const FROM = process.env.EMAIL_FROM || 'Nativly <noreply@nativly.az>'

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<
  { ok: true; skipped?: boolean } | { ok: false; error: string }
> {
  const resend = getClient()

  // Dormant mode — log and succeed without sending.
  if (!resend) {
    console.info(
      `[email] RESEND_API_KEY not set — skipping email to ${to} ("${subject}")`
    )
    return { ok: true, skipped: true }
  }

  try {
    await resend.emails.send({ from: FROM, to, subject, html })
    return { ok: true }
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown email error'
    console.error('[email] send failed:', error)
    return { ok: false, error }
  }
}
