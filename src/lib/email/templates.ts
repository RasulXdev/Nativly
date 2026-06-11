/**
 * Az-language transactional email templates (Nativly branding).
 * Each returns { subject, html } ready for sendEmail().
 */

interface BaseData {
  recipientName: string
  counterpartName: string
  scheduledAt: string // ISO
}

const BRAND = '#6366f1'

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('az-AZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function shell(title: string, bodyHtml: string): string {
  return `
  <div style="background:#0b0b12;padding:32px 0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#14141f;border:1px solid #26263a;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,${BRAND},#8b5cf6);padding:24px 28px;">
        <span style="color:#fff;font-size:20px;font-weight:800;letter-spacing:-0.02em;">Nativly</span>
      </div>
      <div style="padding:28px;color:#e5e7eb;">
        <h1 style="margin:0 0 16px;font-size:18px;color:#fff;">${title}</h1>
        ${bodyHtml}
      </div>
      <div style="padding:18px 28px;border-top:1px solid #26263a;color:#6b7280;font-size:12px;">
        Nativly — onlayn dil təhsili platforması
      </div>
    </div>
  </div>`
}

function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 0;color:#9ca3af;font-size:13px;">${label}</td>
    <td style="padding:6px 0;color:#fff;font-size:13px;text-align:right;font-weight:600;">${value}</td>
  </tr>`
}

export function bookingConfirmed(data: BaseData): { subject: string; html: string } {
  const html = shell(
    'Dərsiniz təsdiqləndi 🎉',
    `<p style="margin:0 0 16px;font-size:14px;line-height:1.6;">
       Salam ${data.recipientName}, dərsiniz uğurla təsdiqləndi.
     </p>
     <table style="width:100%;border-collapse:collapse;margin:8px 0 20px;">
       ${infoRow('Müəllim/Tələbə', data.counterpartName)}
       ${infoRow('Tarix', formatDateTime(data.scheduledAt))}
       ${infoRow('Müddət', '30 dəqiqə')}
     </table>
     <p style="margin:0;font-size:13px;color:#9ca3af;">Dərsdən əvvəl bildiriş alacaqsınız.</p>`
  )
  return { subject: 'Dərsiniz təsdiqləndi — Nativly', html }
}

export function lessonReminder(data: BaseData): { subject: string; html: string } {
  const html = shell(
    'Dərsiniz yaxınlaşır ⏰',
    `<p style="margin:0 0 16px;font-size:14px;line-height:1.6;">
       Salam ${data.recipientName}, ${data.counterpartName} ilə dərsiniz tezliklə başlayır.
     </p>
     <table style="width:100%;border-collapse:collapse;margin:8px 0 20px;">
       ${infoRow('Tarix', formatDateTime(data.scheduledAt))}
       ${infoRow('Müddət', '30 dəqiqə')}
     </table>
     <p style="margin:0;font-size:13px;color:#9ca3af;">Zamanında qoşulmağı unutmayın.</p>`
  )
  return { subject: 'Dərs xatırlatması — Nativly', html }
}

export function lessonCancelled(
  data: BaseData & { reason?: string }
): { subject: string; html: string } {
  const html = shell(
    'Dərs ləğv edildi',
    `<p style="margin:0 0 16px;font-size:14px;line-height:1.6;">
       Salam ${data.recipientName}, ${formatDateTime(data.scheduledAt)} tarixli dərsiniz ləğv edildi.
     </p>
     ${
       data.reason
         ? `<p style="margin:0 0 16px;font-size:13px;color:#9ca3af;">Səbəb: ${data.reason}</p>`
         : ''
     }
     <p style="margin:0;font-size:13px;color:#9ca3af;">Yeni dərs rezerv etmək üçün platformaya daxil olun.</p>`
  )
  return { subject: 'Dərs ləğv edildi — Nativly', html }
}
